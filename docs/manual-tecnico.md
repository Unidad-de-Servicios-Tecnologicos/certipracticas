# Manual Técnico — CertiPrácticas

## 1. Propósito

Este documento describe la implementación técnica, estructura del proyecto y puntos de extensión. Está orientado a desarrolladores, mantenimiento y soporte.

> Nota: la versión actual **no implementa dictado por voz**.

## 2. Stack y herramientas

- **React 19 + TypeScript**
- **Vite + SWC**
- **TailwindCSS v4**
- **Zustand** (estado global + persistencia)
- **Vitest + React Testing Library**
- **Exportación**: `jspdf`, `docx`, `file-saver`
- **IA**: `@google/genai` (Gemini)

## 3. Estructura del código (carpetas)

```
src/
├── components/
│   ├── editor/       Editor canvas + herramientas (logos, toolbar, etc.)
│   ├── form/         Formulario (captura de datos + IA)
│   ├── layout/       Shell visual (SplitView, Header, Theme)
│   ├── preview/      Preview + ExportBar + templates
│   ├── signature/    Captura/gestión de firma
│   └── ui/           Componentes atómicos (presentacionales)
├── data/             Constantes, defaults, keys storage
├── hooks/            Hooks React (p.ej. `useExport`)
├── pages/            Composición de vistas
├── services/         Lógica pura (sin React): exporters, IA, validación, schema IO
├── store/            Zustand stores (form/app)
├── types/            Tipos de dominio y esquemas
├── utils/            Helpers genéricos
└── test/             Setup de pruebas
```

## 4. Modelo de dominio (Letter)

La entidad central es `Letter` y se compone de sub-entidades (aprendiz, centro, periodo, actividades, instructor, firmantes, metadata).

Puntos relevantes actuales:

- **Actividades**: se modelan como **proyectos** estructurados (`code`, `name`, `description`).
- **Instructor**: incluye `extension` además de `phone`.

## 5. Estado global (Zustand)

### 5.1 `useFormStore` (persistente)

Responsabilidad: estado del documento y configuración persistente.

Incluye:

- `letter`
- `signature` y `signatureLayout`
- `documentSchema` (logos/elementos visuales) y `schemaHistory` (undo/redo)
- `textOverrides` (texto institucional editable por clave)
- `canvasHtml` (HTML cuando el usuario edita el documento en modo canvas)

Persistencia:

- Se guarda en `localStorage` (key definida en `STORAGE_KEYS.form`).
- Tiene `merge` personalizado para migraciones (p.ej. convertir `tasks: string[]` antiguo a `Project[]`).

### 5.2 `useAppStore` (no persistente)

Responsabilidad: estado efímero de UI:

- `theme`
- `zoom`
- `isExporting`
- `editorMode` (preview/edit)

## 6. Plantilla visual y esquema (JSON)

### 6.1 `documentSchema`

Representa el “canvas” de elementos visuales. En la implementación actual se usa principalmente para **logos**:

- sección: `header` / `footer` / `body`
- alineación, posición (%), tamaño (px), zIndex, locked, etc.

### 6.2 Importación/exportación de plantilla

Servicios:

- `services/editorSchemaIO.ts`: serializa/deserializa (JSON).
- `services/editorSchemaService.ts`: sanitiza y crea defaults.

UI:

- `components/preview/ExportBar.tsx`: botones de export/import JSON.
- `components/editor/LogoManagerPanel.tsx`: CRUD de logos.

## 7. Editor visual (canvasHtml)

El modo “edit” habilita edición rica mediante:

- `contenteditable`
- `document.execCommand` para formatos (bold, align, font size, color, etc.)

Trade-off:

- `execCommand` es legacy pero ampliamente soportado; encapsular en componentes para aislar futuros cambios.

## 8. Firma manuscrita

La firma se guarda como `dataUrl` (`image/png`) y se controla con `signatureLayout`:

- `scale`
- `rotationDeg`
- `align`
- `xPct`, `yPct`

UI:

- `components/signature/SignaturePanel.tsx` + subcomponentes de dibujo/carga.

Exportadores:

- **PDF**: inserta con `pdf.addImage(...)`.
- **DOCX**: inserta como `ImageRun(...)`.

## 9. Exportación

### 9.1 PDF (`services/pdfExporter.ts`)

Salida:

- PDF A4, unit mm.
- Texto con `jsPDF.text`.
- Logos y firma con `jsPDF.addImage`.

Consideraciones:

- Logos se convierten a dataURL con `fetch` + `FileReader` (posibles fallos CORS si no son locales).

### 9.2 DOCX (`services/docxExporter.ts`)

Salida:

- Documento `docx` generado programáticamente.
- Inserta logos/firma como `ImageRun`.
- Guarda con `file-saver`.

## 10. IA (Gemini)

Servicio:

- `services/aiService.ts`

Características:

- Sanitización básica de inputs.
- 3 tipos de generación (actividades, fortalezas, evaluación).

Seguridad:

- `VITE_GEMINI_API_KEY` queda embebida en bundle: mitigar con restricciones HTTP referrer + cuotas.

## 11. Validación

Servicio:

- `services/validators.ts`

Regla clave:

- Debe existir al menos 1 proyecto válido (con algún campo no vacío).

## 12. Pruebas

- Unit tests en `src/**/**/*.test.ts(x)`.
- Vitest como runner.

Comandos:

- `npm run test:run`
- `npm run lint`

## 13. Guía rápida para extender

### Agregar un campo al modelo

- Actualizar tipos en `src/types/`.
- Actualizar defaults (`src/data/defaultLetter.ts`).
- Actualizar `merge` en `useFormStore` para rehidratación.
- Ajustar `validators`, exportadores y UI del formulario.

### Agregar un nuevo elemento al esquema visual

- Extender `types/editorSchema.ts`.
- Extender `createDefaultDocumentSchema` y `sanitizeDocumentSchema`.
- Crear panel de control en `components/editor/`.
- Integrar render/export si aplica.

