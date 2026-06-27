## Why

El layout UX v2 fijó anchos rígidos entre formulario y preview, perdiendo el divisor arrastrable del `SplitView` original. Además, el usuario espera ver cada dato reflejado al instante en la carta; hoy hay lag visual (`previewHasChanges`), campos nuevos (fortalezas, evaluación) sin representación en `SenaTemplate`, y el modo edición canvas puede desincronizar el preview reactivo.

## What Changes

- Restaurar **divisor arrastrable** entre área de formulario y panel de preview en desktop (≥1024px).
- Persistir proporción formulario/preview en `localStorage` entre sesiones.
- Límites min/max de ancho para sidebar, formulario y preview (no romper layout).
- **Preview en tiempo real**: cada cambio del store debe reflejarse inmediatamente en `SenaTemplate` (sin botón "actualizar").
- Eliminar o corregir indicador engañoso de "cambios pendientes" que sugiere desincronización.
- Sincronizar campos faltantes en plantilla: fortalezas técnicas y evaluación de desempeño (si aplican al formato SENA).
- En modo `preview`, garantizar re-render reactivo; en modo `edit`, comportamiento documentado (HTML estático vs React).
- Soporte touch para redimensionar en tablet.

## Capabilities

### New Capabilities

- `panel-resize`: Divisor arrastrable formulario ↔ preview con persistencia y límites.
- `live-preview-sync`: Sincronización instantánea formulario → vista previa para todos los campos editables.

### Modified Capabilities

- `preview-panel`: Añadir requisito de divisor redimensionable y sync en tiempo real (delta en change specs).

## Impact

- `GeneratorPageV2.tsx` — reemplazar columnas fijas por layout resizable.
- `SplitView.tsx` o nuevo `ResizableWorkspace.tsx` — adaptar a 3 columnas (sidebar fija o colapsable + split form/preview).
- `useAppStore` — `formPanelWidth`, `previewPanelWidth` o ratio único.
- `PreviewPanel.tsx` — quitar delay artificial de `previewHasChanges`.
- `SenaTemplate.tsx` / `letterFormatter.ts` — campos faltantes en preview.
- `LetterPreview.tsx` — asegurar suscripción granular al store.
- Sin cambios en exportadores, validators ni estructura de datos del dominio.
