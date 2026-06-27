## 1. Panel resize

- [x] 1.1 Extraer hook `usePanelResize` desde lógica de `SplitView.tsx`
- [x] 1.2 Crear componente `ResizablePanels.tsx` (left=form, right=preview, divisor)
- [x] 1.3 Integrar en `GeneratorPageV2` reemplazando columnas fijas
- [x] 1.4 Persistir ratio en `localStorage` (`certipracticas-panel-ratio-v1`)
- [x] 1.5 Aplicar min-width form 280px, preview 320px
- [x] 1.6 Soporte touch en divisor (reuse SplitView handlers)

## 2. Live preview sync

- [x] 2.1 Eliminar timeout artificial de `previewHasChanges` en `PreviewPanel.tsx`
- [x] 2.2 Verificar suscripciones Zustand en `LetterPreview` / `SenaTemplate`
- [x] 2.3 Mapear `technicalStrengths` en `SenaTemplate` + `letterFormatter.ts`
- [x] 2.4 Mapear `performanceReview` en `SenaTemplate` + `letterFormatter.ts`
- [x] 2.5 Asegurar proyectos, firma y metadata se actualizan en tiempo real
- [x] 2.6 Banner informativo en modo `edit` cuando form cambia (opcional)

## 3. QA

- [x] 3.1 Probar resize + persistencia tras reload
- [x] 3.2 Probar sync campo por campo en cada sección del formulario V2
- [x] 3.3 Verificar export PDF/DOCX tras resize
- [x] 3.4 Actualizar tests de `letterFormatter` si se añaden campos
