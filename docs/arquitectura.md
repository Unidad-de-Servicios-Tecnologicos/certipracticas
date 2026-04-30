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
- **Exportación client-side**: PDF por captura DOM → imagen, DOCX por construcción programática con `docx`.

---

## 2. Modelo de dominio

El objeto central es `Letter` (`src/types/letter.ts`). Es un agregado plano de 8 sub-entidades, cada una en su propio archivo de tipos:

```
Letter
├── intern        (Intern)          — aprendiz: nombre, doc, ciudad, programa, género
├── center        (TrainingCenter)  — centro: nombre, regional, dirección, teléfono, código/versión doc
├── period        (Period)          — fechas, duración, modalidad, unidad, área
├── activities    (Activities)      — tareas[], fortalezas[], evaluación de desempeño
├── instructor    (Instructor)      — nombre, teléfono, email
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
│  Hooks  (useSpeechToText, useExport…)   │  Estado React + side effects
├─────────────────────────────────────────┤
│  Store  (useFormStore, useAppStore)      │  Estado global Zustand
├─────────────────────────────────────────┤
│  Services  (puro, sin React)            │
│  ├── letterFormatter   — texto carta    │
│  ├── aiService         — Gemini API     │
│  ├── pdfExporter       — jsPDF+DOM      │
│  ├── docxExporter      — docx lib       │
│  ├── validators        — validaciones   │
│  ├── speechService     — Web Speech API │
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

### `useAppStore` — estado de UI (no persistente)
- `theme`: 'light' | 'dark'
- `zoom`: [0.5, 2.0] — nivel de zoom del preview
- `activeMicFieldId`: qué campo tiene el micrófono activo (solo uno a la vez)
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

**Invariante:** `SenaTemplate.tsx` importa las funciones de `letterFormatter` para el render HTML/PDF, y `docxExporter.ts` las usa parcialmente para el DOCX. Si se cambia la redacción de un texto, hay que actualizar **ambos** exportadores.

---

## 6. Pipeline de exportación

### PDF (html-to-image + jsPDF)
```
LetterPreview (ref DOM) 
  → pdfExporter.exportLetterAsPDF(element, letter)
    → querySelectorAll('[data-letter-page]')  → array de páginas
    → toPng(page, { pixelRatio: 3, width: 794, height: 1123 })
    → jsPDF.addImage(imgData, 'PNG', 0, 0, 210mm, height)
    → pdf.save(filename)
```

Limitaciones:
- Calidad depende del render del navegador. Fuentes externas, sombras y degradados complejos pueden verse mal.
- No es texto real (es imagen), por lo que el PDF no es buscable ni accesible.
- El `pixelRatio: 3` da alta resolución pero aumenta el tamaño del archivo.

### DOCX (docx + file-saver)
```
docxExporter.exportLetterAsDOCX(letter)
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

## 8. Componente de plantilla

`SenaTemplate.tsx` es el único template actual. Estructura fija de 2 páginas:

- **Página 1** (`data-letter-page="1"`): logo, clasificación, número doc, fecha, título, subtítulo, cuerpo, actividades, footer.
- **Página 2** (`data-letter-page="2"`): logo, fortalezas, evaluación desempeño, datos instructor, fecha, cierre, firmante, proyectó, footer.

El atributo `data-letter-page` es el contrato con `pdfExporter` — cada nodo con ese atributo se captura como una página de PDF independiente.

Dimensiones fijas: `794px × 1123px` (A4 a 96 DPI aprox). No es responsive; está diseñado para verse a tamaño fijo en el panel de preview.

---

## 9. Dictado por voz

`useSpeechToText` encapsula la Web Speech API. Solo un campo puede estar activo a la vez (coordinado por `useAppStore.activeMicFieldId`). `MicButton` se monta dentro de cada campo de texto que soporte dictado. El silencio de 3s (`MIC_SILENCE_MS`) detiene la grabación automáticamente.

---

## 10. Deuda técnica y fricciones conocidas

| Área | Problema | Impacto |
|------|----------|---------|
| `val()` duplicado | Definida en `letterFormatter.ts` Y en `docxExporter.ts` | Si cambia la lógica de placeholders, hay que actualizar dos lugares |
| Texto duplicado | `docxExporter` reconstruye frases que ya existen en `letterFormatter` | Riesgo de divergencia entre PDF/HTML y DOCX |
| PDF como imagen | No es texto real: no es buscable, no es accesible, tamaño grande | Limitación aceptada por simplicidad, documentar para el usuario |
| API key en bundle | `VITE_GEMINI_API_KEY` expuesta en el JS público | Mitigado con HTTP referrer restrictions; no apto para uso multi-tenant |
| Un solo template | `SenaTemplate` es hardcoded, no hay sistema de templates | `STORAGE_KEYS.templates` y `STORAGE_KEYS.activeTemplate` están reservados pero sin implementar |
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
                      → pdfExporter.exportLetterAsPDF(ref.current, letter)
                        → toPng por página → jsPDF → pdf.save()
                          → useAppStore.setExporting(false)
```
