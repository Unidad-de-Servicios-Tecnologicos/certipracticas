# ux-navigation-flow

## Purpose

Capability synced from change integral-ui-ux-a11y-redesign.


## ADDED Requirements

### Requirement: Landing entry points
Landing page SHALL offer three entry paths: start blank form, continue saved draft (if localStorage has data), and optional demo/template preview.

#### Scenario: Continue draft
- **WHEN** user has persisted form data and clicks Continuar
- **THEN** app navigates to generator with data restored and toast confirmation

#### Scenario: Start blank
- **WHEN** user clicks Empezar
- **THEN** app navigates to generator; optional StartChoiceModal if first visit

### Requirement: Optional onboarding wizard
First-time users MAY see a 3-step wizard (aprendiz → centro → periodo) skippable at any step; preference stored in localStorage.

#### Scenario: Skip wizard
- **WHEN** user skips wizard
- **THEN** full form remains accessible via sidebar sections

### Requirement: Sidebar section navigation
Generator SHALL show sidebar with all form sections, completion indicator per section, and error badge when section has validation errors.

#### Scenario: Section jump
- **WHEN** user clicks sidebar section
- **THEN** main content scrolls to that section and section is marked active

### Requirement: Progress visibility
Global progress bar SHALL show percentage complete; StatusBar SHALL show autosave state (saved timestamp, saving, error).

#### Scenario: Autosave feedback
- **WHEN** form data changes
- **THEN** StatusBar shows "Guardando…" then "Guardado hace Xs"

### Requirement: Command palette discovery
Header SHALL expose keyboard shortcut hint (⌘K / Ctrl+K) and command palette SHALL list navigation, theme toggle, export, and help actions.

### Requirement: AI panel access
AI generation SHALL be reachable from dedicated section and optionally from command palette; SHALL NOT block form editing.

### Requirement: Export flow
Export PDF and DOCX SHALL be accessible from header and preview panel via keyboard-operable menu with loading and error feedback.

### Requirement: Empty and error states
Each major area (lists, preview, IA) SHALL show appropriate empty, loading, and error states with recovery actions.

### Requirement: Reset confirmation
Resetting form data SHALL require explicit confirmation modal to prevent accidental data loss.

### Requirement: Onboarding tour relaunch
User SHALL be able to relaunch OnboardingTour from help menu or command palette.

## MODIFIED Requirements

### Requirement: Mobile form-preview flow
On viewports below md breakpoint, form and preview SHALL use accessible tabs; switching tabs SHALL preserve scroll position where possible.

#### Scenario: Tab switch mobile
- **WHEN** user selects Preview tab on mobile
- **THEN** preview panel is visible and form is hidden without losing unsaved data
