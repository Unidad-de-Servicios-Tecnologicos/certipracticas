## Context

CertiPrácticas UX v2 (`GeneratorPageV2`) usa layout de 3 columnas con anchos CSS fijos (`flex-1`, `max-w-[50%]`). La v1 tenía `SplitView` con divisor arrastrable entre formulario y preview.

`LetterPreview` ya suscribe `useFormStore((s) => s.letter)` y renderiza `SenaTemplate`. La reactividad funciona para campos mapeados en la plantilla, pero:
- `technicalStrengths` y `performanceReview` no están en `SenaTemplate`.
- `PreviewPanel` marca `previewHasChanges` con timeout de 600ms, confundiendo al usuario.
- Modo `edit` desmonta React y usa `contenteditable` — cambios del formulario no se ven hasta volver a `preview`.

## Goals / Non-Goals

**Goals:**
- Divisor arrastrable formulario ↔ preview en desktop
- Persistir ratio del split
- Preview actualizado en cada keystroke/select (modo preview)
- Todos los campos del formulario V2 visibles en la carta (o placeholder `[campo]`)

**Non-Goals:**
- Redimensionar sidebar (opcional fase 2; solo form/preview en v1 de este change)
- Cambiar lógica de exportación PDF/DOCX
- Backend o WebSockets

## Decisions

### D1: Reutilizar lógica de `SplitView` para form + preview

**Decisión:** Extraer hook `usePanelResize` del `SplitView` existente; envolver formulario y preview en `ResizablePanels` dentro de `GeneratorPageV2`.

**Alternativa:** Librería `react-resizable-panels` — descartada para no añadir dependencia.

**Rationale:** Código probado en v1; ~80 líneas reutilizables.

### D2: Persistir ratio en localStorage

**Clave:** `certipracticas-panel-ratio-v1`  
**Valor:** número 20–80 (% ancho formulario respecto al área form+preview)

### D3: Live sync sin debounce en preview

**Decisión:** React re-render directo vía Zustand; eliminar `setPreviewHasChanges` con timeout.

**Indicador opcional:** pulso sutil en borde del preview al cambiar (100ms), no badge "Cambios".

### D4: Campos faltantes en plantilla

**Decisión:** Si el formato SENA oficial incluye fortalezas/evaluación, añadir secciones en `SenaTemplate` usando `letterFormatter`. Si no, mostrar solo campos ya definidos en la carta actual.

**Acción:** Revisar `SenaTemplate` y mapear `activities.technicalStrengths` y `activities.performanceReview` donde corresponda en el texto legal.

### D5: Modo edición canvas

**Decisión:** Al cambiar datos del formulario en modo `edit`, mostrar toast: "Vuelve a vista previa para ver cambios del formulario" O auto-switch a preview al editar form (preferido: **auto-switch a preview** cuando `activeSection` cambia un campo — demasiado agresivo).

**Mejor:** Documentar que live sync aplica en `editorMode: preview`. Si usuario está en edit, banner inline en preview: "Modo edición activo — los cambios del formulario se aplican al salir."

### D6: Mobile sin resize

Tabs Formulario/Preview se mantienen; sin divisor en `< lg`.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| Performance con re-render completo de SenaTemplate | Template es 1 página; aceptable. Si lag, `useDeferredValue` solo en listas largas |
| Split estrecho rompe preview A4 | min-width 320px preview, min-width 280px form |
| localStorage quota | Un número, negligible |
| Regresión export PDF | Export captura DOM; no cambiar estructura de `data-letter-page` |

## Migration Plan

1. Implementar `ResizablePanels` en paralelo sin quitar layout fijo (flag interno).
2. Conectar persistencia ratio.
3. Fix live sync + template gaps.
4. Quitar layout fijo.
5. QA export PDF/DOCX post-resize.

## Open Questions

1. ¿Fortalezas y evaluación van en cuerpo de la carta SENA o son campos internos no exportados?
2. ¿Auto-volver a modo preview al editar formulario?
