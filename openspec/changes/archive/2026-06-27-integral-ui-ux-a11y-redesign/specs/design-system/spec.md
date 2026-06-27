# Design System

## ADDED Requirements

### Requirement: Semantic color tokens
The system SHALL define semantic color tokens for light and dark mode: background, foreground, surface, surface-elevated, border, border-subtle, primary, secondary, muted, accent, success, warning, danger, info, focus-ring, sidebar, preview-canvas.

#### Scenario: Theme toggle
- **WHEN** user toggles theme
- **THEN** all semantic tokens swap to dark/light values without hardcoded hex in components

#### Scenario: Contrast compliance
- **WHEN** text uses foreground on background or surface
- **THEN** contrast ratio SHALL be ≥ 4.5:1 for normal text and ≥ 3:1 for large text (WCAG AA)

### Requirement: Typography scale
The system SHALL provide tokens: display, h1, h2, h3, body, body-sm, caption, label with defined size, weight, and line-height.

#### Scenario: Heading hierarchy
- **WHEN** a page section renders a title
- **THEN** it uses h1-h3 tokens consistently, not arbitrary Tailwind sizes

### Requirement: Spacing system
The system SHALL use a 4px base spacing scale (space-1 through space-16) for padding, margin, and gaps.

#### Scenario: Component padding
- **WHEN** a Card or Input is rendered
- **THEN** internal padding uses spacing tokens, not arbitrary values

### Requirement: Border radius tokens
The system SHALL define radius tokens: sm (4px), md (8px), lg (12px), xl (16px), full.

### Requirement: Elevation tokens
The system SHALL define shadow-sm, shadow-md, shadow-lg for elevated surfaces (modals, dropdowns, floating toolbars).

### Requirement: Motion tokens
The system SHALL define duration-fast (150ms), duration-normal (250ms), duration-slow (400ms) and respect prefers-reduced-motion.

#### Scenario: Reduced motion
- **WHEN** user prefers reduced motion
- **THEN** animations are disabled or reduced to opacity-only transitions ≤ 50ms

### Requirement: Button component
Button SHALL support variants (primary, secondary, ghost, danger), sizes (sm, md, lg), states (default, hover, focus, disabled, loading), and minimum touch target 44×44px for icon-only buttons.

#### Scenario: Loading state
- **WHEN** button is in loading state
- **THEN** it shows spinner, is disabled, and announces busy state to assistive tech via aria-busy

### Requirement: Input component
Input SHALL support variants, error state with aria-invalid, association with error message via aria-describedby, and visible focus ring.

### Requirement: Modal/Dialog component
Dialog SHALL implement focus trap, Escape to close, aria-modal, aria-labelledby, return focus to trigger on close.

### Requirement: Dropdown component
Dropdown SHALL be fully keyboard operable (Arrow keys, Enter, Escape), not hover-only, with aria-expanded on trigger.

### Requirement: Empty State component
Empty State SHALL support icon, title, description, and optional CTA; used consistently for empty lists and sections.

### Requirement: Skeleton component
Skeleton SHALL provide loading placeholders for form sections and preview panel.

### Requirement: Documentation
Design tokens and component API SHALL be documented in docs/design-system.md after R1-R3 implementation.
