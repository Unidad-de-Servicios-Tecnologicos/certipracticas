---
name: frontend-ux-a11y
description: >
  Specialized frontend agent combining UI/UX design, React 19 + TypeScript + Tailwind v4 patterns,
  and WCAG 2.2 accessibility. Use when building or reviewing components, pages, design systems,
  or when the task involves visual quality, interaction patterns, keyboard navigation, screen reader
  support, color contrast, or responsive layout in this project.
---

# Frontend UI/UX + Accessibility Expert

Specialized guidance for **React 19 + TypeScript + Tailwind v4** applications. Applies UI/UX design
principles and WCAG 2.2 accessibility standards simultaneously — neither discipline is optional.

---

## Activation Triggers

Invoke this skill when the task involves ANY of:
- Building or refactoring React components or pages
- Choosing colors, typography, spacing, or layout
- Reviewing UI for quality, usability, or consistency
- Keyboard navigation, focus management, or screen reader support
- Color contrast, ARIA attributes, or semantic HTML
- Responsive design or mobile-first layout
- Form design, error states, or interactive feedback
- Animation or transition behavior

---

## Core Principle: Accessible Design IS Good Design

Every visual decision must satisfy both aesthetics and accessibility. These are not in conflict —
well-contrasted colors, clear focus states, and semantic structure produce better designs for everyone.

---

## Stack Constraints (Non-Negotiable)

```
React 19 functional components only — no class components
TypeScript — all props typed with {ComponentName}Props interfaces
Tailwind v4 via Vite plugin — no tailwind.config.js, no inline styles
clsx via @/utils/cn — all conditional classnames
Named exports — no default exports (except lazy-loaded routes)
react-icons — all iconography
Zustand — cross-component state (useFormStore, useAppStore)
```

---

## UI/UX Design Rules

### Layout & Spacing

- Mobile-first breakpoints: `sm:` → `md:` → `lg:` → `xl:`
- Minimum tap target: **44×44px** (buttons, links, toggles)
- Spacing scale: prefer `4` / `8` / `12` / `16` / `24` / `32` / `48` / `64`
- No horizontal scroll on any viewport
- Generous whitespace > cramped density
- Logical visual hierarchy: size, weight, color, space

### Typography

- Body: minimum `text-base` (16px), `leading-relaxed`
- Headings: sequential h1→h6, never skip levels
- Line length: 45–80 characters for readability (use `max-w-prose` or `max-w-2xl`)
- Never use `text-xs` (12px) for body content

### Color & Contrast

| Pair | Minimum ratio |
|------|---------------|
| Normal text on background | 4.5 : 1 |
| Large text (18px+ or 14px bold) | 3 : 1 |
| UI components & focus indicators | 3 : 1 |

- Never convey meaning by color alone — always add icon/text/shape
- Use CSS variables / Tailwind tokens, never raw hex in components
- Dark mode: test every component in both `light` and `dark`

### Motion & Animation

- Duration: 150–300ms for micro-interactions, 300–500ms for page transitions
- Always add `motion-reduce:` variant or `prefers-reduced-motion` media query
- Motion must convey meaning (state change, spatial relationship) — never decorative only
- Never animate `width` / `height` directly — use `transform` / `opacity`

```tsx
// ✅ Tailwind v4 reduced-motion pattern
<div className="transition-transform duration-200 motion-reduce:transition-none" />
```

### Forms

- Every input must have a visible `<label>` — never placeholder-only labels
- Error messages placed **near the field**, not only at top of form
- Show helper text upfront for fields with format requirements
- `aria-required`, `aria-invalid`, `aria-describedby` for assistive tech

```tsx
// ✅ Accessible field pattern
<div className="flex flex-col gap-1">
  <label htmlFor={id} className="text-sm font-medium text-foreground">
    {label}
    {required && <span aria-hidden="true" className="text-red-500 ml-1">*</span>}
  </label>
  <input
    id={id}
    aria-required={required}
    aria-invalid={!!error}
    aria-describedby={error ? `${id}-error` : undefined}
    className={cn(
      "rounded-md border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary",
      error && "border-red-500"
    )}
  />
  {error && (
    <p id={`${id}-error`} role="alert" className="text-sm text-red-600">
      {error}
    </p>
  )}
</div>
```

---

## Accessibility (WCAG 2.2) Checklist

### Perceivable
- [ ] All images have descriptive `alt` text; decorative images have `alt=""`
- [ ] Color contrast meets 4.5:1 for text, 3:1 for large text and UI components
- [ ] Information is not conveyed by color alone
- [ ] Text scales correctly when browser font size increases (no `px` for font-size)

### Operable
- [ ] All interactive elements reachable by keyboard (`Tab`, `Enter`, `Space`, arrow keys)
- [ ] Focus indicators visible on all focusable elements (never `outline-none` without custom ring)
- [ ] No keyboard traps
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Touch targets ≥ 44×44px

### Understandable
- [ ] Language set: `<html lang="es">` for this project
- [ ] Labels clearly describe their controls
- [ ] Error messages are specific and actionable
- [ ] Required fields identified in label (not only by color)

### Robust
- [ ] Semantic HTML elements used (not `<div>` for buttons/headings)
- [ ] ARIA roles/states/properties used correctly
- [ ] Interactive widgets have correct roles (`role="dialog"`, `role="alert"`, etc.)
- [ ] Logical tab order matching visual order

---

## Component Patterns

### Button

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

// Rules:
// - Never icon-only without aria-label
// - loading state disables + shows spinner + aria-busy
// - focus:ring-2 focus:ring-offset-2 never removed
```

### Modal / Dialog

```tsx
// Rules:
// - role="dialog" + aria-modal="true" + aria-labelledby
// - Focus trapped inside while open (focus-trap-react or manual)
// - Escape key closes modal
// - Focus returns to trigger element on close
// - Backdrop click closes (unless destructive action)
```

### Icon Button

```tsx
// ✅ Always provide accessible name
<button aria-label="Cerrar formulario" className="...">
  <FiX aria-hidden="true" />
</button>
```

### Skip Link (required for keyboard users)

```tsx
// Place as first element in <body>
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
>
  Ir al contenido principal
</a>
```

---

## Review Checklist (use before marking any UI task done)

### Visual Quality
- [ ] Consistent spacing using Tailwind scale
- [ ] Typography hierarchy clear (h1 > h2 > body)
- [ ] Interactive states: hover, focus, active, disabled
- [ ] Dark mode tested
- [ ] Responsive at sm / md / lg

### Accessibility
- [ ] Run through WCAG Perceivable / Operable / Understandable / Robust checklist
- [ ] Semantic HTML (no `div` as button/heading)
- [ ] All images have alt text
- [ ] Focus order logical
- [ ] Color contrast verified
- [ ] Keyboard navigation tested

### Code Quality
- [ ] Props typed with `{ComponentName}Props`
- [ ] No inline styles
- [ ] `cn()` used for conditional classes
- [ ] Named export
- [ ] No business logic in `components/ui/`

---

## Anti-Patterns (Never Do)

| Anti-Pattern | Why | Fix |
|---|---|---|
| `outline-none` without custom focus ring | Breaks keyboard nav | Add `focus:ring-2 focus:ring-primary` |
| `<div onClick={...}>` | Not keyboard accessible | Use `<button>` |
| `placeholder` as the only label | Disappears on input | Add visible `<label>` |
| Icon-only button without `aria-label` | Screen reader sees nothing | Add `aria-label` |
| Color only for errors | Color-blind users miss it | Add icon + text |
| `text-xs` for body content | Fails readability | `text-sm` minimum for UI, `text-base` for body |
| `transition-none` on all elements | Removes all feedback | Use only for reduced-motion |
| Skipping heading levels (h1 → h3) | Breaks screen reader navigation | Keep h1→h2→h3 sequential |
| Fixed `px` heights on containers | Breaks when text scales | Use `min-h` + padding |
| `disabled` without visual indication | User doesn't know why | Add `opacity-50 cursor-not-allowed` + tooltip |

---

## Project-Specific Context

This is **CertiPrácticas** — a document generation tool for SENA internship certificates.

- **Primary users**: SENA instructors and administrators (range of tech literacy)
- **Critical flows**: Form filling → Live preview → Export PDF/DOCX
- **Accessibility priority**: Keyboard navigation is essential (form-heavy app)
- **Theme**: Professional, institutional, trustworthy — not playful
- **Colors**: Use established design tokens; check `useAppStore` for current theme
- **Voice input**: `useSpeechToText` hook — indicate recording state clearly with ARIA live regions
- **Export**: `isExporting` from `useAppStore` — block UI interactions during export with `aria-busy`
