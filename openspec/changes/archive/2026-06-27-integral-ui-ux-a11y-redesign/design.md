# Diseño — Rediseño Integral UI/UX y Accesibilidad

> **Estado:** Planificación. Sin implementación hasta aprobación explícita.

---

## Fase 1 — Descubrimiento

### Fortalezas actuales

| Área | Detalle |
|------|---------|
| Arquitectura | Separación clara: `services/` puros, `store/` Zustand, `types/` dominio |
| UX v2 | Layout profesional: sidebar, progreso, paneles redimensionables, command palette |
| Funcionalidad | Formulario completo SENA, preview live, IA Gemini, PDF/DOCX, dictado, autosave |
| Testing | Vitest + RTL, mocks Speech API, tests en services y hooks |
| Theming | CSS variables light/dark, `useTheme`, toggle funcional |
| Accesibilidad parcial | Skip link, focus visible, `prefers-reduced-motion`, algunos `aria-*` |

### Debilidades

- **Dual stack v1/v2** con feature flag — duplicación masiva (~15 componentes)
- **Design system implícito** — tokens parciales, sin escala tipográfica/spacing formal
- **Componentes monolíticos** — `LetterFormV2` (~400+ líneas), `SenaTemplate` extenso
- **A11y incompleta** — Modal sin focus trap, errores sin `aria-describedby`, hover-only en ExportDropdown
- **Código muerto** — `previewHasChanges`, `MicButton` no cableado, `FieldTooltip` sin uso
- **Landing desconectada** — CTAs no enlazan flujo onboarding real

### Problemas UX (resumen)

- Descubrimiento de IA/exportación no obvio para usuarios nuevos
- Formulario largo sin orientación clara en v1; v2 mejora pero falta wizard inicial
- Sin undo/redo (documentado en `docs/history-api-design.md`, no implementado)
- Feedback de autosave sutil; validación dispersa
- Mobile: tabs form/preview OK pero densidad alta en campos

### Problemas UI

- Inconsistencia v1/v2 en botones, cards, espaciados
- Tipografía sin escala documentada (mezcla `text-sm`, `text-base` ad hoc)
- Iconografía react-icons sin tamaños unificados
- Animaciones Motion sin tokens de duración/easing centralizados
- Empty states recién añadidos — no en todos los módulos

### Problemas accesibilidad

- Contraste secundario/muted en dark mode borderline
- Tab order en modales y command palette no auditado
- Labels implícitos en algunos campos dinámicos
- Errores de validación no anunciados a screen readers
- Touch targets < 44px en icon buttons pequeños
- `ExportDropdown` requiere hover — inaccesible teclado/touch

### Deuda técnica UI

- Duplicación `LetterForm` / `LetterFormV2`
- `SplitView` vs `ResizablePanels`
- `ExportBar` vs export en `HeaderV2`/`PreviewPanel`
- Stores: `previewHasChanges` sin uso
- CSS: variables `--color-*` sin sistema 4/8px

### Componentes reutilizables existentes

`Button`, `Input`, `Textarea`, `Select`, `Modal`, `Toast`, `Badge`, `Card`, `EmptyState`, `ProgressBar`, `CommandPalette`, `OnboardingTour`, `ValidationSummary`, `ResizablePanels`

### Componentes a dividir

| Componente | Propuesta |
|------------|-----------|
| `LetterFormV2` | Una sección por archivo: `InternSection`, `CenterSection`, etc. |
| `SenaTemplate` | `SenaPage1`, `SenaPage2`, bloques reutilizables |
| `GeneratorPageV2` | Solo composición; lógica en hooks |
| `LandingPage` | Hero, Features, CTA como subcomponentes |

### Oportunidades Design System

- Formalizar `@theme` Tailwind v4 con tokens semánticos
- Storybook o catálogo interno (opcional fase 2)
- Variantes CVA o similar para Button/Input (evaluar sin añadir deps innecesarias)
- Documentar en `docs/design-system.md` post-implementación

---

## Fase 2 — Auditoría UX (Heurísticas Nielsen)

| # | Problema | Severidad | Heurística |
|---|----------|-----------|------------|
| 1 | Sin undo/redo — pérdida datos accidental | **Crítico** | Control y libertad |
| 2 | Errores validación no agrupados hasta scroll (v1) | **Alto** | Prevención errores |
| 3 | IA oculta en sección — bajo descubrimiento | **Alto** | Visibilidad estado |
| 4 | Landing CTAs no conectan flujo real | **Alto** | Match sistema/mundo real |
| 5 | Exportación en dropdown hover-only | **Crítico** | Accesibilidad = UX |
| 6 | Onboarding tour skippable pero no re-lanzable fácil | **Medio** | Ayuda y documentación |
| 7 | Progreso % no explica campos faltantes | **Medio** | Visibilidad estado |
| 8 | Command palette sin descubrimiento visual | **Medio** | Reconocimiento vs recuerdo |
| 9 | Mobile: cambio form↔preview interrumpe flujo | **Medio** | Flexibilidad eficiencia |
| 10 | Sin confirmación al reset formulario | **Alto** | Prevención errores |
| 11 | Autosave silencioso — usuario no sabe si guardó | **Medio** | Visibilidad estado |
| 12 | Dictado (`MicButton`) no integrado en v2 | **Alto** | Consistencia |
| 13 | Tooltips campos (`FieldTooltip`) sin usar | **Bajo** | Ayuda |
| 14 | Tema: sin sync `prefers-color-scheme` inicial | **Medio** | Estética minimalista |
| 15 | Zoom preview separado de zoom global confuso | **Bajo** | Consistencia |

**Priorización:** Críticos 1,5 → Altos 2,3,4,10,12 → Medios → Bajos.

---

## Fase 3 — Auditoría UI y Sistema Visual Propuesto

### Estado actual

- **Tipografía:** Inter/system stack; sin escala (display, h1-h6, body, caption)
- **Espaciado:** Tailwind defaults; sin `--space-*` tokens
- **Layout:** Grid/flex ad hoc; v2 usa sidebar 240px + resizable split
- **Cards:** `Card` básico; bordes `border-border`
- **Botones:** variantes primary/secondary/ghost; falta loading/disabled consistente
- **Inputs:** focus ring OK; error state inconsistente
- **Modales:** overlay + panel; sin animación estándar
- **Colores:** primary verde SENA-ish; semantic colors parciales
- **Dark mode:** funcional; algunos contrastes borderline
- **Responsive:** breakpoints Tailwind; mobile tabs en v2
- **Animaciones:** Motion puntual; sin design tokens motion

### Sistema visual propuesto (inspiración: Linear, Notion, Vercel)

**Principios:** Claridad, densidad adaptable, feedback inmediato, accesible por defecto.

#### Colores (tokens semánticos)

```
background, foreground
surface, surface-elevated
border, border-subtle
primary, primary-foreground
secondary, secondary-foreground
muted, muted-foreground
accent, accent-foreground
success, warning, danger, info (+ foreground cada uno)
focus-ring
sidebar, sidebar-foreground
preview-canvas (gris neutro tipo Figma)
```

Light: fondos `#FAFAFA` / surface `#FFFFFF`; dark: `#0A0A0A` / `#171717` (referencia Vercel/Linear, no copia).

#### Tipografía

| Token | Size | Weight | Line-height |
|-------|------|--------|-------------|
| display | 2.25rem | 700 | 1.2 |
| h1 | 1.875rem | 600 | 1.25 |
| h2 | 1.5rem | 600 | 1.3 |
| h3 | 1.25rem | 600 | 1.4 |
| body | 1rem | 400 | 1.5 |
| body-sm | 0.875rem | 400 | 1.5 |
| caption | 0.75rem | 400 | 1.4 |
| label | 0.875rem | 500 | 1.4 |

Fuente: **Inter** (ya usada) o **Geist** si se adopta sin peso bundle extra.

#### Espaciado (base 4px)

`space-1` (4px) … `space-16` (64px). Layout gutters: 16 mobile, 24 desktop.

#### Border radius

`sm: 4px`, `md: 8px`, `lg: 12px`, `xl: 16px`, `full`

#### Elevaciones

`shadow-sm`, `shadow-md`, `shadow-lg` — solo en modals, dropdowns, preview floating toolbar.

#### Motion

`duration-fast: 150ms`, `duration-normal: 250ms`, `duration-slow: 400ms`; easing `ease-out`. Respetar `prefers-reduced-motion: reduce`.

---

## Fase 4 — Accesibilidad WCAG 2.2 AA

### Checklist

| Criterio | Estado | Acción |
|----------|--------|--------|
| 1.1.1 Non-text Content | Parcial | Alt en logos; decorativos `aria-hidden` |
| 1.3.1 Info and Relationships | Parcial | `fieldset`/`legend` en secciones form |
| 1.4.3 Contrast (Minimum) | Parcial | Auditar muted/border dark; corregir < 4.5:1 |
| 1.4.11 Non-text Contrast | Parcial | Focus rings, icon buttons |
| 2.1.1 Keyboard | Falla | ExportDropdown, algunos menus |
| 2.1.2 No Keyboard Trap | Parcial | Modal sin trap completo |
| 2.4.1 Bypass Blocks | OK | Skip link existe |
| 2.4.3 Focus Order | Parcial | Auditar modals, sidebar |
| 2.4.7 Focus Visible | OK | `:focus-visible` en CSS |
| 2.5.5 Target Size | Parcial | Icon buttons → min 44×44 |
| 3.3.1 Error Identification | Falla | `aria-invalid`, `aria-describedby` |
| 3.3.2 Labels or Instructions | Parcial | DynamicList items |
| 4.1.2 Name, Role, Value | Parcial | Tabs mobile, custom controls |
| 2.3.3 Animation from Interactions | OK | reduced-motion |

**Sprint a11y obligatorio antes de release v2 definitivo.**

---

## Fase 5 — Nuevo Flujo de Usuario

```
Landing → [Nuevo / Continuar / Plantilla] → OnboardingTour (opcional)
    → Generator (Sidebar secciones + Form + Preview live)
        ↔ Command Palette (⌘K)
        ↔ Panel IA (drawer lateral)
        ↔ Export (header + preview toolbar)
    → Descarga PDF/DOCX
```

| Elemento | Propuesta |
|----------|-----------|
| Bienvenida | Landing con 3 CTAs: empezar vacío, continuar borrador, ver demo |
| Wizard inicial | Modal 3 pasos: datos aprendiz → centro → periodo (opcional skip) |
| Sidebar | Secciones con icono + % completitud + badge errores |
| Checklist progreso | Barra global + por sección en sidebar |
| Autosave visible | StatusBar: "Guardado hace Xs" / "Guardando…" / error |
| Historial | Fase futura — localStorage snapshots (ver history-api-design) |
| Undo/redo | Fase futura — CommandHistory en store |
| Atajos | Ya existe; documentar en ShortcutsPanel + ? |
| Panel IA | Drawer derecho; no bloquear form |
| Panel export | Dropdown accesible + botones en PreviewPanel |
| Plantillas | Fase 2 — presets en localStorage |
| Empty states | Por sección y listas vacías (parcialmente hecho) |
| Loading/error | Skeleton preview, toast errores IA/export |

---

## Fase 6 — Design System (catálogo)

Ver spec `design-system` para requisitos completos por componente.

**Componentes prioritarios:** Button, Input, Textarea, Select, Modal/Dialog, Toast, Card, Badge, EmptyState, Skeleton, Progress, Sidebar, Tabs, Dropdown (accesible), Tooltip, Alert.

**Fase 2 componentes:** Drawer, Accordion, Command Palette (refactor), Context Menu, Breadcrumb, Spinner.

Cada uno: variantes × estados × tamaños × a11y × ejemplos.

---

## Fase 7 — Arquitectura Frontend Propuesta

```
src/
├── components/
│   ├── ui/           # Primitivos design system (sin lógica negocio)
│   ├── layout/       # AppShell, Header, Sidebar, Panels
│   ├── form/
│   │   ├── sections/ # Una carpeta, un componente por sección SENA
│   │   └── shared/   # DynamicList, FieldGroup, MicField
│   └── preview/
├── hooks/
├── pages/            # LandingPage, GeneratorPage (único post-cutover)
├── store/
├── services/         # Sin cambios
└── styles/
    └── tokens.css    # @theme tokens (opcional split de index.css)
```

**Acciones:**
1. Eliminar v1 tras paridad funcional v2
2. Extraer secciones de `LetterFormV2`
3. Unificar export en un `ExportMenu` accesible
4. Cablear `MicButton`, `FieldTooltip`
5. Limpiar dead code en stores
6. Evaluar `React.lazy` para Landing y CommandPalette (bundle)

---

## Fase 8 — Roadmap de Implementación

| Fase | Objetivo | Riesgo | Tiempo | Deps | Complejidad | Impacto |
|------|----------|--------|--------|------|-------------|---------|
| **R0** | Aprobación plan | Bajo | — | — | — | — |
| **R1** | Design tokens + CSS | Bajo | 2-3d | R0 | Baja | Alto |
| **R2** | A11y sprint (críticos) | Medio | 3-4d | R1 | Media | Crítico |
| **R3** | UI primitives refactor | Medio | 4-5d | R1 | Media | Alto |
| **R4** | Split form sections | Medio | 3-4d | R3 | Media | Medio |
| **R5** | Flujo landing + wizard | Bajo | 2-3d | R3 | Media | Alto |
| **R6** | Cablear mic, tooltips, export | Bajo | 2d | R3 | Baja | Medio |
| **R7** | Cutover v1 eliminación | Alto | 2-3d | R4,R6 | Alta | Alto |
| **R8** | Undo/redo (opcional) | Alto | 5-7d | R7 | Alta | Medio |
| **R9** | Tests + a11y audit final | Medio | 3-4d | R7 | Media | Crítico |
| **R10** | Plantillas + polish | Bajo | 3-5d | R7 | Media | Bajo |

**Total estimado:** 27-38 días dev (1 dev), o 4-6 semanas con buffer.

**Orden recomendado:** R1 → R2 → R3 → R4 → R5 → R6 → R7 → R9 → (R8, R10 paralelo opcional)

### Criterios aceptación globales por fase

- Lint (`npm run lint`) verde
- Tests (`npm run test:run`) verde
- Sin regresión export PDF/DOCX
- Preview live funcional
- Checklist a11y fase aplicable cumplida

---

## Fase 9 — Product Backlog (resumen)

Ver `tasks.md` para historias detalladas. Épicas:

1. **EPIC-DS** — Design System
2. **EPIC-A11Y** — Accesibilidad WCAG 2.2
3. **EPIC-FLOW** — Flujo usuario y onboarding
4. **EPIC-ARCH** — Arquitectura y cutover v2
5. **EPIC-POLISH** — Plantillas, undo, animaciones

---

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Regresión export PDF | Media | Alto | Tests snapshot + manual QA |
| Cutover v1 rompe usuarios flag=false | Baja | Medio | Comunicar; periodo deprecación |
| Scope creep design system | Alta | Medio | MVP componentes; iterar |
| Undo/redo complejidad store | Alta | Medio | Fase opcional post-MVP |
| Contraste dark mode | Media | Medio | Herramienta contrast checker en CI |

---

## Estimación de esfuerzo

| Área | Story points (aprox) |
|------|---------------------|
| Design tokens | 5 |
| A11y | 13 |
| Componentes UI | 21 |
| Form refactor | 13 |
| Flujo/onboarding | 8 |
| Cutover v1 | 8 |
| Tests/QA | 8 |
| Undo/plantillas (opcional) | 21 |
| **MVP (sin opcionales)** | **~68 SP (~6-8 semanas)** |

---

## Dependencias externas

- Ninguna librería nueva obligatoria
- Opcional: `@radix-ui/*` para primitives a11y (evaluar vs implementación manual)
- Mantener: Motion, react-hot-toast, react-icons

---

## Aprobación requerida

**No implementar ninguna fase hasta confirmación explícita del usuario.**

Tras aprobación: ejecutar `/opsx:apply` o solicitar implementación fase R1.
