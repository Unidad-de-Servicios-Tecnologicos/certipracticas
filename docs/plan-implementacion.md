# Plan: Completar y Optimizar CertiPrácticas

## Contexto

La aplicación ya tiene una base sólida (formulario, preview en tiempo real, export PDF/DOCX, IA). El objetivo es completarla con tres capacidades faltantes y corregir un modelo de datos incorrecto frente al PDF de referencia:

1. **Modelo de datos roto**: `activities.tasks` es `string[]` pero el PDF tiene proyectos con código + nombre + descripción estructurados. El `sampleLetter` embute la extensión en el campo `phone` como workaround.
2. **Sin firmas**: El PDF muestra una imagen de firma manuscrita en la zona "Proyectó". No hay mecanismo ni para subir imagen ni para dibujar.
3. **Sin editor visual**: Los textos estáticos del template (título del subdirector, "HACE CONSTAR QUE:", etc.) son hardcodeados en `SenaTemplate.tsx` y no se pueden personalizar.
4. **Calidad PDF ya resuelta**: `pdfExporter.ts` ya usa `pixelRatio: 3`. No requiere cambio.

---

## Diagnóstico técnico

### Estado actual del proyecto

| Módulo | Estado | Notas |
|---|---|---|
| Formulario dinámico | ✅ Implementado | Buena base |
| Preview en tiempo real | ✅ Implementado | Split-view redimensionable |
| Exportación PDF | ✅ Implementado | pixelRatio: 3 ya configurado |
| Exportación DOCX | ✅ Implementado | Con logo y estilos |
| Dictado por voz | ❌ No implementado | Fuera del alcance actual |
| Generación IA (Gemini) | ✅ Implementado | Solo provider activo |
| Autosave localStorage | ✅ Implementado | Con persist de Zustand |
| Editor visual (Canva-like) | ❌ No existe | — |
| Sistema de firmas | ❌ No existe | — |

### Problemas identificados

**P1 — Modelo de datos incorrecto**
`Activities.tasks: string[]` debe ser `Project[]` para separar código, nombre y descripción de cada proyecto.

**P2 — Campo `extension` ausente**
`Instructor.extension` no existe. El PDF muestra "ext. 42253". En `sampleLetter` está embebido en `phone` como workaround.

**P3 — Sin sistema de firmas**
El PDF muestra firma manuscrita encima de "Proyectó". No hay mecanismo de subida ni dibujo.

**P4 — Textos estáticos no editables**
"El SUBDIRECTOR ENCARGADO...", "HACE CONSTAR QUE:", pie de contacto — hardcodeados en `SenaTemplate.tsx`.

---

## Fases de implementación

> Orden estricto por dependencias: los tipos van primero porque causan errores TS en cascada.

---

### Fase A — Modelo de datos correcto

**Archivos a modificar/crear:**

#### `src/types/activities.ts`
```typescript
export interface Project {
  code: string;        // "P2023-014296-13274"
  name: string;        // "StampArt"
  description: string; // "Plataforma e-commerce..."
}

export interface Activities {
  tasks: Project[];           // CAMBIA de string[]
  technicalStrengths: string[];
  performanceReview: string;
}
```

#### `src/types/instructor.ts`
```typescript
export interface Instructor {
  fullName: string;
  phone: string;
  extension: string;  // NUEVO — "42253"
  email: string;
}
```

#### `src/types/signature.ts` ← archivo nuevo
```typescript
export type SignatureMethod = 'drawn' | 'uploaded';

export interface SignatureData {
  method: SignatureMethod;
  dataUrl: string;   // base64 PNG
  createdAt: string; // ISO
}
```

#### `src/utils/parseProject.ts` ← archivo nuevo
Helper compartido entre el store (migración) y el form (parseo de IA):
```typescript
import type { Project } from '@/types/activities';

export function parseProjectFromString(raw: string): Project {
  const match = raw.match(/^(P\d{4}-\d{6}-\d{5})\s*[–—-]\s*([^:]+):\s*(.+)$/s);
  if (match) return { code: match[1].trim(), name: match[2].trim(), description: match[3].trim() };
  const colonMatch = raw.match(/^([^:]+):\s*(.+)$/s);
  if (colonMatch) return { code: '', name: colonMatch[1].trim(), description: colonMatch[2].trim() };
  return { code: '', name: '', description: raw };
}
```

#### `src/data/defaultLetter.ts`
- `emptyLetter.activities.tasks`: `['']` → `[{ code: '', name: '', description: '' }]`
- `emptyLetter.instructor`: agregar `extension: ''`
- `sampleLetter.activities.tasks`: convertir las dos strings a `Project[]` estructurados
- `sampleLetter.instructor.phone`: quitar "extensión 42253" del phone, poner `extension: '42253'`

#### `src/store/useFormStore.ts`
Cambios:
1. Importar `Project`, `SignatureData`, `parseProjectFromString`
2. Agregar a la interfaz `FormStore`:
   - `signature: SignatureData | null` + `setSignature`
   - `textOverrides: Record<string, string>` + `setTextOverride` + `resetTextOverrides`
3. Cambiar firmas de tasks para trabajar con `Project`:
   - `setTasks: (tasks: Project[]) => void`
   - `updateTask: (index: number, patch: Partial<Project>) => void`
   - `addTask`: inserta `{ code: '', name: '', description: '' }`
   - `removeTask`: fallback a `[{ code:'', name:'', description:'' }]`
4. Eliminar la lógica de auto-split en `updateTask`
5. En `merge` del `persist`, agregar migración de localStorage:

```typescript
// Migrar tasks: string[] → Project[] desde localStorage antiguo
if (state.letter?.activities?.tasks?.length > 0) {
  if (typeof state.letter.activities.tasks[0] === 'string') {
    state.letter.activities.tasks = (state.letter.activities.tasks as string[])
      .map(parseProjectFromString);
  }
}
if (state.letter?.instructor && state.letter.instructor.extension === undefined) {
  state.letter.instructor.extension = '';
}
if (!state.textOverrides) state.textOverrides = {};
if (state.signature === undefined) state.signature = null;
```

#### `src/store/useAppStore.ts`
```typescript
export type EditorMode = 'preview' | 'edit';
// Agregar: editorMode: EditorMode = 'preview'
// Agregar: setEditorMode: (mode: EditorMode) => void
```

#### `src/services/letterFormatter.ts`
- Actualizar `buildInstructorLine` para incluir `extension`
- Agregar `formatProject(project: Project): string`:
```typescript
export function formatProject(p: Project): string {
  const head = [p.code.trim(), p.name.trim()].filter(Boolean).join(' – ');
  return [head, p.description.trim()].filter(Boolean).join(': ');
}
```

#### `src/services/validators.ts`
```typescript
const validTasks = letter.activities.tasks.filter(
  (p) => p.code.trim() || p.name.trim() || p.description.trim()
);
if (validTasks.length === 0) errors['activities.tasks'] = 'Agrega al menos 1 proyecto';
```

#### `src/services/docxExporter.ts`
- Importar `formatProject` de `letterFormatter`
- Cambiar: `activities.tasks.map(formatProject)` en lugar de strings directos
- Agregar `instructor.extension` en la línea de contacto

#### Tests afectados (actualizar, no crear nuevos):
- `src/store/useFormStore.test.ts`
- `src/services/validators.test.ts`
- `src/services/letterFormatter.test.ts`
- `src/services/docxExporter.test.ts`

---

### Fase B — Sistema de firmas

#### `src/components/signature/SignatureCanvas.tsx` ← nuevo
Canvas HTML con mouse + touch para dibujar firma:
- `useRef<HTMLCanvasElement>` con `getContext('2d')`
- Eventos: `onMouseDown/Move/Up/Leave` + `onTouchStart/Move/End`
- Función `getPos` normalizada por `getBoundingClientRect` + escala canvas vs display
- Canvas interno: `width={480} height={180}`, display: `w-full`
- Botones: "Limpiar" + "Usar firma" → `onSave(canvas.toDataURL('image/png'))`
- `strokeStyle: '#000'`, `lineWidth: 2`, `lineCap: 'round'`
- Props: `{ onSave: (dataUrl: string) => void; className?: string }`

#### `src/components/signature/SignatureUpload.tsx` ← nuevo
Drag & drop + click para subir imagen:
- `useRef<HTMLInputElement>` tipo `file` hidden
- Estado: `preview: string | null`, `isDragging: boolean`
- `onDrop`: llama `FileReader.readAsDataURL`
- Zona drop: borde dashed, hover/drag con `cn()`
- Muestra `<img>` preview cuando hay imagen
- Botones: "Cambiar" + "Usar imagen" → `onSave(preview)`
- Props: `{ onSave: (dataUrl: string) => void; className?: string }`

#### `src/components/signature/SignaturePanel.tsx` ← nuevo
Panel con tabs "Dibujar" | "Subir imagen":
- Estado: `activeTab: 'drawn' | 'uploaded'`
- Lee `signature` del store para mostrar firma guardada actual
- `handleSave(dataUrl)` → `setSignature({ method: activeTab, dataUrl, createdAt: new Date().toISOString() })`
- Muestra firma guardada con botón "Eliminar" → `setSignature(null)`

#### `src/components/form/LetterForm.tsx`
Agregar sección de firma al final:
```typescript
<FormSection title="Firma digital" icon={<FaSignature />} defaultOpen={false}>
  <SignaturePanel />
</FormSection>
```

#### `src/components/preview/templates/SenaTemplate.tsx`
- Recibir `signature?: SignatureData | null` como prop
- Mostrar sobre "Proyectó:":
```tsx
{signature && (
  <img src={signature.dataUrl} alt="Firma"
    className="mb-1 max-h-[70px] max-w-[180px] object-contain" />
)}
```

#### `src/components/preview/LetterPreview.tsx`
```typescript
const signature = useFormStore((s) => s.signature);
// ...
<SenaTemplate letter={letter} signature={signature} />
```

---

### Fase C — Editor visual inline

#### `src/components/editor/EditableBlock.tsx` ← nuevo
Wrapper click-to-edit para textos estáticos del template:
- Lee `editorMode` de `useAppStore`
- Lee `textOverrides[overrideKey]` de `useFormStore`, fallback a `defaultValue`
- Modo `'preview'`: renderiza `<Tag>{currentValue}</Tag>`
- Modo `'edit'` sin editar: Tag con `cursor-pointer` y outline dashed al hover
- Editando: `<textarea>` con draft — `onBlur`/`Enter` confirma, `Escape` cancela
- Props: `{ overrideKey: string; defaultValue: string; className?: string; as?: keyof JSX.IntrinsicElements }`

#### `src/components/editor/BlockStyleBar.tsx` ← nuevo
Barra toggle editor + reset:
- Botón toggle: "Editar textos" ↔ "Vista previa"
- Botón "Restaurar": aparece si hay overrides, llama `resetTextOverrides()`

#### `src/components/preview/ExportBar.tsx`
Insertar `<BlockStyleBar />` entre `<ZoomControl />` y los botones de exportar.

#### `src/components/preview/templates/SenaTemplate.tsx`
Envolver textos estáticos con `<EditableBlock>`:

| overrideKey | Texto estático |
|---|---|
| `signerHeader` | "El SUBDIRECTOR ENCARGADO DEL..." |
| `haceConstar` | "HACE CONSTAR QUE:" |
| `contactPrefix` | "Cualquier información adicional será suministrada por el experto" |
| `issuedPrefix` | "Se expide esta constancia a solicitud del interesado" |

---

### Fase D — Template actualizado para Project[]

Sub-componente local en `SenaTemplate.tsx`:
```tsx
function ProjectItem({ project }: { project: Project }) {
  const { code, name, description } = project;
  if (!code && !name && !description) return null;
  const header = [code.trim(), name.trim()].filter(Boolean).join(' – ');
  return (
    <li className="text-justify leading-snug">
      {header && <strong>{header}</strong>}
      {header && description && <span>: </span>}
      {description}
    </li>
  );
}
```

Agregar extensión en el párrafo de contacto:
```tsx
{letter.instructor.phone || '[Teléfono]'}
{letter.instructor.extension && ` extensión ${letter.instructor.extension}`}
```

---

### Fase E — Formulario actualizado para Project[]

#### `src/components/form/ProjectList.tsx` ← nuevo
Lista de proyectos estructurados (paralelo a `DynamicList.tsx`):
- Cada `Project` con 3 campos: `code` (Input mono), `name` (Input), `description` (Textarea 3 rows)
- Botón eliminar por item, botón "Añadir proyecto" al final
- Props: `{ items: Project[]; onAdd(); onUpdate(i, patch); onRemove(i); error? }`

#### `src/components/form/LetterForm.tsx`
- Reemplazar `ListTextarea` de tasks por `<ProjectList>`
- Conectar `updateTask` nuevo `(index, patch: Partial<Project>)`
- Actualizar `handleGenerateProjects`: parsear con `parseProjectFromString` → `setTasks(projects)`
- Agregar campo "Extensión" en sección "Experto de contacto"

---

## Orden de ejecución

```
Paso 1:  src/types/activities.ts               → define Project
Paso 2:  src/types/instructor.ts               → agrega extension
Paso 3:  src/types/signature.ts                → nuevo SignatureData
Paso 4:  src/utils/parseProject.ts             → nuevo helper
Paso 5:  src/data/defaultLetter.ts             → migrar a Project[], extension
Paso 6:  src/store/useFormStore.ts             → store migrado + slices firma/overrides
Paso 7:  src/store/useAppStore.ts              → agregar editorMode
Paso 8:  src/services/letterFormatter.ts       → formatProject + extension
Paso 9:  src/services/docxExporter.ts          → usar formatProject
Paso 10: src/services/validators.ts            → validar Project[]
Paso 11: src/components/form/ProjectList.tsx   → nuevo
Paso 12: src/components/form/LetterForm.tsx    → ProjectList + extension + firma
Paso 13: src/components/signature/ (3 files)   → nuevo subsistema
Paso 14: src/components/editor/ (2 files)      → nuevo subsistema
Paso 15: src/components/preview/ExportBar.tsx  → BlockStyleBar
Paso 16: src/components/preview/LetterPreview.tsx → signature prop
Paso 17: src/components/preview/templates/SenaTemplate.tsx → todo junto
Paso 18: Tests afectados                       → actualizar
```

---

## Archivos a modificar (resumen)

| Archivo | Cambio |
|---|---|
| `src/types/activities.ts` | `string[]` → `Project[]` |
| `src/types/instructor.ts` | Agregar `extension` |
| `src/types/signature.ts` | **Nuevo** |
| `src/utils/parseProject.ts` | **Nuevo** |
| `src/data/defaultLetter.ts` | Migrar tasks, separar extensión |
| `src/store/useFormStore.ts` | Migración + slices firma/overrides |
| `src/store/useAppStore.ts` | Agregar `editorMode` |
| `src/services/letterFormatter.ts` | `formatProject`, extension |
| `src/services/docxExporter.ts` | Usar `formatProject` |
| `src/services/validators.ts` | Validar `Project[]` |
| `src/components/form/ProjectList.tsx` | **Nuevo** |
| `src/components/form/LetterForm.tsx` | ProjectList + extension + SignaturePanel |
| `src/components/signature/SignatureCanvas.tsx` | **Nuevo** |
| `src/components/signature/SignatureUpload.tsx` | **Nuevo** |
| `src/components/signature/SignaturePanel.tsx` | **Nuevo** |
| `src/components/editor/EditableBlock.tsx` | **Nuevo** |
| `src/components/editor/BlockStyleBar.tsx` | **Nuevo** |
| `src/components/preview/ExportBar.tsx` | Agregar `BlockStyleBar` |
| `src/components/preview/LetterPreview.tsx` | Pasar `signature` |
| `src/components/preview/templates/SenaTemplate.tsx` | Project[], firma, EditableBlock |

---

## Funciones existentes a reutilizar

- `cn()` en `src/utils/cn.ts` — classnames condicionales
- `notify` en `src/utils/toast.ts` — errores y confirmaciones
- `Button`, `Input`, `Textarea` en `src/components/ui/`
- `FormSection` en `src/components/form/FormSection.tsx`
- `useFormStore` / `useAppStore` — estado global
- `formatDateLong` en `src/utils/formatDate.ts`

---

## Verificación

1. `npm run lint` — sin errores TypeScript
2. `npm run test:run` — todos los tests pasan
3. Cargar muestra → verificar en preview: proyectos con código/nombre/descripción y extensión en contacto
4. Dibujar firma → guardar → aparece sobre "Proyectó" en el preview
5. Subir imagen de firma → guardar → aparece en preview
6. Activar modo edición → clic en "HACE CONSTAR QUE:" → editar → persiste al recargar
7. Exportar PDF → proyectos estructurados con código en negrita
8. Exportar DOCX → proyectos formateados correctamente
