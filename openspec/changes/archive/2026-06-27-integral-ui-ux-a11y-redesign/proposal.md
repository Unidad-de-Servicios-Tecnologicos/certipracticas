## Why

CertiPrácticas es funcional y ya tiene UX v2 parcial (~95%), pero convive con código legacy, tokens incompletos, gaps de accesibilidad WCAG 2.2 AA y un design system implícito sin documentar. Para alcanzar calidad tipo Canva/Notion/Linear hace falta un plan integral que unifique UI, UX, a11y y arquitectura frontend sin tocar el dominio ni romper exportación/IA.

## What Changes

- **Fase 0 (planificación):** Auditorías UX/UI/a11y, flujo propuesto, design system, arquitectura, roadmap, backlog — **sin código hasta aprobación**.
- **Fase 1+ (post-aprobación):** Design tokens formales, componentes accesibles, cutover v1→v2, a11y sprint, refactor componentes grandes, unificación duplicados.
- **No cambia:** lógica de negocio, tipos de dominio, `services/` (pdf, docx, ai, validators), estructura de datos del store.

## Capabilities

### New Capabilities

- `design-system`: Tokens, tipografía, color, spacing, elevación y catálogo de componentes.
- `accessibility-wcag`: Cumplimiento WCAG 2.2 AA con checklist y requisitos verificables.
- `ux-navigation-flow`: Flujo usuario completo: bienvenida → wizard → generador → export.
- `frontend-architecture`: Estructura escalable, splits, eliminación duplicación v1/v2.

### Modified Capabilities

- `app-layout`, `form-navigation`, `preview-panel`, `autosave-feedback`, `keyboard-shortcuts` — deltas en specs del change `ux-redesign-general` (referencia conceptual; specs locales en este change).

## Impact

- `src/index.css` — tokens design system
- `src/components/ui/` — primitivos + variantes a11y
- `src/components/layout/`, `pages/` — cutover v2 único
- `src/components/form/` — split LetterFormV2, unificar con v1
- Eliminación gradual: `GeneratorPage`, `LetterForm`, `SplitView` legacy, `ExportBar`
- Tests + lint + a11y en cada fase de implementación
- Sin impacto: `services/`, `types/`, exportadores, integración Gemini
