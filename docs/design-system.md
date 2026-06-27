# Design System — CertiPrácticas

Tokens semánticos definidos en `src/styles/tokens.css` e `src/index.css`.

## Colores

| Token | Uso |
|-------|-----|
| `--color-background` | Fondo app |
| `--color-foreground` | Texto principal |
| `--color-surface` | Cards, inputs |
| `--color-surface-elevated` | Dropdowns, modals |
| `--color-muted` | Fondos sutiles |
| `--color-muted-foreground` | Texto secundario |
| `--color-border` | Bordes |
| `--color-primary` | Acción principal |
| `--color-success/warning/danger/info` | Semánticos |

Light y dark en `:root` / `.dark`.

## Tipografía

Utilities: `.text-display`, `.text-h1`–`.text-h3`, `.text-body-sm`, `.text-caption`, `.text-label`.

## Espaciado

Base 4px: `--space-1` … `--space-16`.

## Radius

`--radius-sm` (4px) … `--radius-xl` (16px).

## Sombras

`--shadow-sm`, `--shadow-md`, `--shadow-lg`.

## Motion

`--duration-fast/normal/slow`, `prefers-reduced-motion` en `index.css`.

## Componentes UI

`Button`, `Input`, `Textarea`, `Select`, `Modal`, `Dropdown`, `Card`, `Alert`, `Badge`, `EmptyState`, `Skeleton`, `ConfirmDialog`, `Tooltip`, `Spinner`, `ProgressBar`.

### Button

Variantes: `primary`, `secondary`, `ghost`, `danger`, `outline`. Tamaños: `sm`, `md`, `lg`. Props: `loading`, `iconOnly`.

### Input / Textarea / Select

Props: `error`, `hint`, `aria-invalid`, `aria-describedby` automáticos.

### Modal

Focus trap, Escape, restore focus, `aria-modal`, `aria-labelledby`.

### Dropdown

Keyboard + click, no hover-only. Usado en `ExportMenu`.

## Layout

`AppShellV2`, `HeaderV2`, `SidebarNav`, `PreviewPanel`, `ResizablePanels`, `StatusBar`.

## Formulario

Secciones en `src/components/form/sections/`. Cada sección usa `FormSectionShell` con `fieldset`/`legend`.
