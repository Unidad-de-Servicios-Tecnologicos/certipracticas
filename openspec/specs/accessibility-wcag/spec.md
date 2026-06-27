# accessibility-wcag

## Purpose

Capability synced from change integral-ui-ux-a11y-redesign.


## ADDED Requirements

### Requirement: Keyboard accessibility
All interactive elements SHALL be operable via keyboard without requiring hover or pointer-specific gestures.

#### Scenario: Export menu
- **WHEN** user tabs to export trigger and presses Enter or Space
- **THEN** export options open and are navigable by keyboard

#### Scenario: Mobile tabs
- **WHEN** user navigates form/preview tabs with keyboard
- **THEN** tabs use role="tablist", role="tab", aria-selected, and roving tabindex

### Requirement: Focus management
Modals and command palette SHALL trap focus while open and restore focus to trigger on close.

#### Scenario: Modal open
- **WHEN** modal opens
- **THEN** focus moves to first focusable element inside modal

#### Scenario: Modal close
- **WHEN** modal closes via Escape or close button
- **THEN** focus returns to element that opened the modal

### Requirement: Form error accessibility
Invalid fields SHALL have aria-invalid="true" and aria-describedby pointing to error message element with role="alert" or aria-live="polite".

#### Scenario: Validation on submit
- **WHEN** form submit fails validation
- **THEN** first invalid field receives focus and error is announced to screen readers

#### Scenario: ValidationSummary
- **WHEN** ValidationSummary displays errors
- **THEN** it uses aria-live region and links jump to invalid fields

### Requirement: Labels and instructions
Every form control SHALL have an associated visible label or aria-label; dynamic list items SHALL have accessible names.

### Requirement: Skip navigation
Application SHALL provide skip link to main content, visible on focus, as first focusable element.

### Requirement: Color contrast
Text and interactive boundaries SHALL meet WCAG 2.2 AA contrast ratios; audit SHALL cover light and dark themes.

### Requirement: Touch targets
Interactive targets SHALL be at least 44×44 CSS pixels unless inline text links.

### Requirement: Motion preferences
Animations SHALL respect prefers-reduced-motion; no essential information conveyed by motion alone.

### Requirement: Screen reader landmarks
Layout SHALL use semantic landmarks: header, nav (sidebar), main, complementary (preview), status (autosave bar).

### Requirement: Automated a11y checks
Before v2 cutover release, manual audit checklist in design.md Phase 4 SHALL be verified; optional axe-core in component tests for critical flows.
