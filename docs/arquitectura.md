# Spec de Arquitectura — CertiPrácticas

> Documento de referencia para tomar decisiones de diseño, extender funcionalidad y mantener coherencia técnica del proyecto.
> Actualizar cuando cambie una decisión estructural, no para cada feature.

---

## 1. Propósito del sistema

CertiPrácticas es una **SPA client-side** (sin backend propio) que permite generar Certificaciones de Ejecución de Etapa Productiva del SENA. Todo el estado vive en el navegador; la única dependencia de red es la API de Gemini para generación IA.

Restricciones que moldean la arquitectura:
- **Sin servidor propio**: no hay base de datos, autenticación ni API interna.
- **Persistencia local**: `localStorage` vía Zustand `persist`.
- **API key expuesta en bundle**: la `VITE_GEMINI_API_KEY` se compila en el JS público. Seguridad depende de restricciones HTTP referrer en Google Cloud Console.
- **Exportación client-side**: PDF con `jsPDF` (texto + imágenes para logos/firma) y DOCX por construcción programática con `docx`.
- **Editor visual**: edición rica basada en HTML (`contenteditable` + `document.execCommand`) y esquema JSON para elementos visuales (logos).

---

## 2. Modelo de dominio

El objeto central es `Letter` (`src/types/letter.ts`). Es un agregado plano de 8 sub-entidades, cada una en su propio archivo de tipos:

```
Letter
├── intern        (Intern)          — aprendiz: nombre, doc, ciudad, programa, género
├── center        (TrainingCenter)  — centro: nombre, regional, dirección, teléfono, código/versión doc
├── period        (Period)          — fechas, duración, modalidad, unidad, área
├── activities    (Activities)      — proyectos[], fortalezas[], evaluación de desempeño
├── instructor    (Instructor)      — nombre, teléfono, extensión, email
├── signer        (Signer)          — nombre, cargo (quien firma)
├── drafter       (Drafter)         — nombre, rol (quien proyectó)
└── metadata      (LetterMetadata)  — número de documento, fecha de expedición, ciudad, clasificación
```

**Regla de dominio crítica:** `period.startDate` es un campo **derivado**. Se recalcula automáticamente en `useFormStore.setPeriod` cuando cambia `duration` o `endDate`. Nunca debe editarse directamente desde el formulario.

**Género como eje de concordancia:** `intern.gender` ('M' | 'F') controla todas las frases del texto de la carta. La función `getGenderTerms()` en `letterFormatter.ts` centraliza este mapeo. Cualquier nuevo texto generado por IA o dinámico debe pasar por ella.

---

## 3. Capas de la arquitectura

```
┌─────────────────────────────────────────┐
│  Pages  (GeneratorPage, LandingPage)     │  Componen layout + componentes + hooks
├─────────────────────────────────────────┤
│  Components                              │
│  ├── layout/  (AppShell, SplitView…)    │  Estructura visual, sin lógica de datos
│  ├── form/    (LetterForm, campos…)     │  Formulario: lee store, llama setters
│  ├── preview/ (LetterPreview, Export…)  │  Render de plantilla + exportación
│  └── ui/      (Button, Input, Modal…)   │  Átomos de presentación, sin lógica
├─────────────────────────────────────────┤
│  Hooks  (useExport…)                    │  Estado React + side effects
├─────────────────────────────────────────┤
│  Store  (useFormStore, useAppStore)      │  Estado global Zustand
├─────────────────────────────────────────┤
│  Services  (puro, sin React)            │
│  ├── letterFormatter   — texto carta    │
│  ├── aiService         — Gemini API     │
│  ├── pdfExporter       — jsPDF+DOM      │
│  ├── docxExporter      — docx lib       │
│  ├── validators        — validaciones   │
│  └── storageService    — localStorage   │
├─────────────────────────────────────────┤
│  Data  (constantes, campos, defaults)   │  Solo exportaciones estáticas
│  Types  (interfaces del dominio)        │  Solo tipos TypeScript
│  Utils  (cn, formatDate, fileDownload…) │  Helpers genéricos
└─────────────────────────────────────────┘
```

**Regla de dependencias:** las capas inferiores no importan capas superiores. `services/` no importa React. `store/` no importa `components/`. `utils/` no importa nada del dominio.

---

## 4. Gestión de estado

### `useFormStore` — datos persistentes
- Persiste en `localStorage` con key `certipracticas.form`.
- Contiene únicamente el objeto `Letter` + setters tipados por sub-entidad.
- **Merge de rehidratación personalizado**: restaura campos faltantes (`documentNumber`, `issueDate`, `startDate`, `endDate`, `gender`) con valores por defecto de `emptyLetter`. Necesario para migraciones suaves cuando se añaden nuevos campos al modelo.
- `updateTask` / `updateStrength`: si el valor contiene `\n` o ` - `, auto-splitea e inserta múltiples ítems (soporte pegar texto con viñetas desde portapapeles).
 - También persiste: `signature`, `signatureLayout`, `documentSchema`, `schemaHistory`, `textOverrides` y `canvasHtml`.

### `useAppStore` — estado de UI (no persistente)
- `theme`: 'light' | 'dark'
- `zoom`: [0.5, 2.0] — nivel de zoom del preview
- `isExporting`: bloquea la UI durante exportación

**Patrón para nuevas features de UI:** estado efímero va a `useAppStore`, datos del documento van a `useFormStore`.

---

## 5. Generación de texto de la carta

`src/services/letterFormatter.ts` contiene **funciones puras** que transforman `Letter` → strings de texto. Es la fuente de verdad del contenido de la carta.

```
buildTitle()           → título SENA centrado
buildSubtitle()        → "EL CARGO DEL CENTRO... HACE CONSTAR:"
buildBodyParagraph()   → párrafo principal con todos los datos del aprendiz
buildActivitiesIntro() → frase introductoria de actividades (usa género)
buildStrengthsIntro()  → frase introductoria de fortalezas
buildClosing()         → "Dado en ciudad, a los fecha."
buildInstructorLine()  → datos del instructor
buildDrafterLine()     → datos de quien proyectó
buildFooterLine()      → pie de página del centro
buildClassificationLabel() → label de clasificación
```

La función `val(value, fieldName)` es el helper de placeholders: devuelve el valor o `[fieldName]` si está vacío. Se usa en ambos `letterFormatter.ts` y `docxExporter.ts` (duplicado — ver deuda técnica).

**Invariante:** el contenido de la carta se mantiene consistente entre preview, PDF y DOCX. Donde sea posible, reutilizar funciones puras; donde no, mantener la redacción sincronizada mediante pruebas/validaciones y revisión.

---

## 6. Pipeline de exportación

### PDF (jsPDF + imágenes)
```
useExport.exportPDF()
  → pdfExporter.exportLetterAsPDF(_, letter, { signature, signatureLayout, documentSchema, textOverrides })
    → jsPDF.text(...) para contenido principal
    → fetch + FileReader para convertir logos a dataURL
    → jsPDF.addImage(...) para logos y firma
    → pdf.save(filename)
```

Limitaciones:
- El layout es “diseño fijo” (posiciones y anchos controlados en el exportador), no responsive.
- Los logos e imágenes se incrustan como raster; el texto del PDF sí queda como texto.
- La disponibilidad de logos remotos depende de CORS; en uso normal se usan dataURL locales.

### DOCX (docx + file-saver)
```
useExport.exportDOCX()
  → docxExporter.exportLetterAsDOCX(letter, { signature, signatureLayout, documentSchema, textOverrides })
  → construye Document con secciones programáticas
  → Packer.toBlob(doc)
  → saveAs(blob, filename)
```

El DOCX construye el texto directamente desde `letter` (no captura el DOM). Hay lógica de formato paralela a `letterFormatter.ts`.

### Nombre de archivo
`buildLetterFilename(fullName, dateStr, extension)` en `utils/fileDownload.ts` genera el nombre normalizado.

---

## 7. Integración IA (aiService)

### Arquitectura actual
- Un solo proveedor activo: **Gemini** (`@google/genai`).
- Tres tipos de generación: `activities`, `strengths`, `performanceReview`.
- El selector de proveedor (`VITE_AI_PROVIDER`) existe pero OpenAI y Anthropic no están implementados.

### Flujo
```
AiGenerateButton (component)
  → generateContent({ programName, type, strengths?, activities? })
    → getPrompt(options)       — construye prompt con sanitización
    → generateWithGemini()
      → GoogleGenAI.models.generateContent()
      → formatGeminiError()    — mapea errores a mensajes en español
    → strip bullets regex
    → return raw text lines
```

### Sanitización de inputs
Antes de construir el prompt, `sanitizeProgramName()` y `sanitizeList()` eliminan caracteres de control, `"`, `` ` ``, `<`, `>` y truncan a límites seguros. Esto previene prompt injection básico.

### Parámetros del modelo
- `temperature: 0.9` — alta creatividad
- `maxOutputTokens: 2048`
- `thinkingBudget: 0` — desactiva chain-of-thought de Gemini para respuestas más rápidas

---

## 8. Plantilla visual y editor (canvas)

La vista previa del documento se construye a partir de:

- **Modelo `Letter`**: datos del formulario (persistentes).
- **`textOverrides`**: reemplazos puntuales de textos institucionales (persistentes).
- **`documentSchema`**: esquema del documento para elementos visuales (principalmente logos) con posicionamiento y capas (persistente).
- **`canvasHtml`**: contenido HTML editado directamente en modo edición (persistente). Permite edición rica (bold/align/tamaño/color) y puede restaurarse desde el formulario.

El editor visual expone:
- Edición de texto enriquecido (mediante `document.execCommand`).
- Undo/redo del esquema del documento (historial de `documentSchema`).
- Alineación masiva o por selección de logos.
- Importación/exportación de la plantilla en JSON.

---

## 9. Dictado por voz (no implementado)

El sistema **no implementa** dictado por voz actualmente. Si se incorpora, se documentará aquí la capa de hooks/servicios y sus restricciones por navegador.

---

## 10. Deuda técnica y fricciones conocidas

| Área | Problema | Impacto |
|------|----------|---------|
| `val()` duplicado | Definida en `letterFormatter.ts` Y en `docxExporter.ts` | Si cambia la lógica de placeholders, hay que actualizar dos lugares |
| Texto duplicado | `docxExporter` reconstruye frases que ya existen en `letterFormatter` | Riesgo de divergencia entre PDF/HTML y DOCX |
| HTML rich text con `execCommand` | API legacy pero ampliamente soportada | Riesgo futuro si navegadores restringen; encapsular en componentes editor |
| API key en bundle | `VITE_GEMINI_API_KEY` expuesta en el JS público | Mitigado con HTTP referrer restrictions; no apto para uso multi-tenant |
| Un solo template | El sistema no tiene múltiples plantillas “oficiales” | La extensión es posible, pero requiere diseño/UX adicional |
| OpenAI / Anthropic stub | `aiService` tiene los stubs pero no la implementación | `VITE_AI_PROVIDER` puede confundir si alguien lo configura |
| `merge` de store manual | Si se añaden nuevos campos a `Letter`, hay que recordar añadirlos al `merge` | Frágil a cambios del modelo de dominio |

---

## 11. Extensiones planificadas / puntos de extensión

### Múltiples plantillas
- `STORAGE_KEYS.templates` y `STORAGE_KEYS.activeTemplate` ya están reservados.
- Patrón sugerido: crear `src/components/preview/templates/` con una interfaz `TemplateComponent = React.FC<{ letter: Letter }>`. El selector de template en `useAppStore` determina cuál renderizar en `LetterPreview`.

### Nuevo proveedor IA
- Implementar `generateWithOpenAI()` / `generateWithAnthropic()` en `aiService.ts`.
- El `switch` en `generateContent()` ya tiene los cases; solo falta el cuerpo.

### Nuevos campos al modelo de dominio
- Añadir la interfaz en `src/types/`.
- Añadir al tipo `Letter`.
- Actualizar `defaultLetter.ts` con el valor por defecto.
- **Añadir al `merge` en `useFormStore`** para que la rehidratación funcione correctamente.
- Actualizar `letterFormatter.ts` y `docxExporter.ts`.

### Historial de cartas
- No hay multi-documento hoy. Para implementarlo: `useFormStore` debería evolucionar a un array de `Letter[]` con un índice activo, o crear un segundo store `useDocumentStore`.

---

## 12. Convenciones de código que no están en el linter

- **Named exports siempre** (excepción: rutas lazy-loaded con `React.lazy`).
- **Props interfaces** nombradas `{ComponentName}Props`.
- Clases condicionales vía `cn()` de `utils/cn.ts` (wrapper de `clsx`), nunca ternarios inline en `className`.
- Notificaciones vía `notify` de `utils/toast.ts` (wrapper de `react-hot-toast`), nunca `toast` directo.
- Idioma: UI en español, código/commits en inglés.
- Sin comentarios excepto cuando el "por qué" no es deducible del código.

---

## 13. Flujo de datos completo (happy path)

```
Usuario escribe en TextField
  → onChange → useFormStore.setIntern/setCenter/... (setter específico)
    → Zustand actualiza letter en memoria
      → persist middleware escribe en localStorage
        → React re-render: LetterPreview lee useFormStore
          → SenaTemplate recibe letter prop
            → letterFormatter.build*() construye strings
              → DOM actualizado en tiempo real
                → Usuario pulsa "Exportar PDF"
                  → useExport.exportPDF()
                    → useAppStore.setExporting(true)
                      → pdfExporter.exportLetterAsPDF(_, letter, opciones)
                        → jsPDF.text + jsPDF.addImage → pdf.save()
                          → useAppStore.setExporting(false)
```
