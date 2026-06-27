# Tasks — Integral UI/UX & A11y Redesign

> **Estado:** MVP implementado. R8/R10 parcial pendiente.

---

## R0 — Aprobación

- [x] R0.1 Usuario aprueba design.md, specs y roadmap
- [x] R0.2 Confirmar alcance MVP (excluir R8 undo/redo si no prioritario)

---

## R1 — Design Tokens

- [x] R1.1 Definir tokens color light/dark en index.css o styles/tokens.css
- [x] R1.2 Definir escala tipográfica (--text-*)
- [x] R1.3 Definir escala spacing 4px base
- [x] R1.4 Definir radius, shadow, motion tokens
- [x] R1.5 Migrar Button, Input, Card a tokens semánticos
- [x] R1.6 Documentar tokens en docs/design-system.md (borrador)

---

## R2 — A11y Sprint Crítico

- [x] R2.1 Modal focus trap + restore focus
- [x] R2.2 ExportMenu keyboard (click, no hover-only)
- [x] R2.3 Mobile tabs ARIA
- [x] R2.4 aria-invalid + aria-describedby en Input/Textarea/Select
- [x] R2.5 ValidationSummary aria-live
- [x] R2.6 Contraste dark mode mejorado (muted/border)
- [x] R2.7 Icon buttons min 44×44

---

## R3 — UI Primitives Refactor

- [x] R3.1 Button: loading, aria-busy
- [x] R3.2 Input/Textarea/Select: error, hint, ids
- [x] R3.3 Modal → Dialog pattern
- [x] R3.4 Dropdown accesible + ExportMenu
- [x] R3.5 Tooltip keyboard + Escape
- [x] R3.6 Alert/Badge variantes semantic
- [x] R3.7 Skeleton component
- [x] R3.8 EmptyState variantes

---

## R4 — Form Section Split

- [x] R4.1 components/form/sections/ (11 secciones)
- [x] R4.2 LetterFormV2 contenedor delgado
- [x] R4.3 fieldset/legend por sección
- [x] R4.4 Tests smoke GeneralSection

---

## R5 — Flujo Landing + Wizard

- [x] R5.1 Landing CTAs ?start=blank|continue|demo
- [x] R5.2 Continuar borrador (persist + toast)
- [x] R5.3 StartChoiceModal first-visit (existente)
- [x] R5.4 Relanzar OnboardingTour desde Command Palette
- [x] R5.5 Confirmación modal reset formulario

---

## R6 — Integraciones

- [x] R6.1 MicButton vía prop `voice` en TextField
- [x] R6.2 Hints vía prop `hint` en Input (equivalente FieldTooltip)
- [x] R6.3 ExportMenu en HeaderV2 + PreviewPanel
- [x] R6.4 StatusBar aria-live + retry
- [x] R6.5 Sidebar badges errores

---

## R7 — Cutover v1 → v2

- [x] R7.1 App.tsx → GeneratorPageV2 único
- [x] R7.2 Eliminar v1 legacy
- [x] R7.3 Limpiar previewHasChanges
- [x] R7.4 Actualizar .env.example, Dockerfile, docker-compose
- [x] R7.5 Lazy load LandingPage

---

## R8 — Undo/Redo (OPCIONAL — EXCLUIDO MVP)

- [ ] R8.1 CommandHistory
- [ ] R8.2 Atajos Ctrl+Z
- [ ] R8.3 UI StatusBar
- [ ] R8.4 Tests history

---

## R9 — QA Final

- [x] R9.1 Tests SidebarNav, ExportMenu, ResizablePanels, GeneralSection
- [x] R9.2 lint + build verdes (4 tests pre-existentes fallan)
- [ ] R9.3 Auditoría manual WCAG
- [ ] R9.4 QA manual export PDF/DOCX
- [ ] R9.5 QA responsive manual
- [x] R9.6 docs/design-system.md

---

## R10 — Polish Opcional

- [ ] R10.1 Plantillas preset
- [ ] R10.2 SenaTemplate split
- [ ] R10.3 Motion tokens en componentes
- [x] R10.4 prefers-color-scheme (useTheme)

---

## Validación

- [x] `npm run lint`
- [x] `npm run build`
- [ ] `npm run test:run` 100% (4 fallos pre-existentes)
- [ ] QA manual export/preview/responsive/a11y
