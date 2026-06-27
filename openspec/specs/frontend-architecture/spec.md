# frontend-architecture

## Purpose

Capability synced from change integral-ui-ux-a11y-redesign.


## ADDED Requirements

### Requirement: Single generator layout
After cutover, application SHALL use GeneratorPageV2 layout only; legacy GeneratorPage, SplitView, LetterForm v1, and ExportBar SHALL be removed.

#### Scenario: Feature flag removal
- **WHEN** cutover is complete
- **THEN** VITE_UX_V2 flag and v1 code paths are removed; App routes directly to unified generator

### Requirement: Form section decomposition
LetterFormV2 SHALL be split into one component per form section under components/form/sections/, composed by a thin LetterForm container.

#### Scenario: Section isolation
- **WHEN** intern section is modified
- **THEN** changes are isolated to InternSection.tsx without editing monolithic form file

### Requirement: Unified export component
Export UI SHALL be consolidated into a single ExportMenu component used by Header and PreviewPanel.

### Requirement: Dead code removal
Unused store fields (e.g. previewHasChanges) and orphaned components SHALL be removed during cutover.

### Requirement: Integration of existing utilities
MicButton SHALL be integrated into v2 form fields; FieldTooltip SHALL be wired to fields defined in form field config.

### Requirement: Preview template modularization
SenaTemplate SHALL be split into page-level subcomponents without changing letter output semantics.

### Requirement: Optional token CSS split
Design tokens MAY live in src/styles/tokens.css imported by index.css for maintainability.

### Requirement: Lazy loading non-critical routes
LandingPage and CommandPalette SHOULD be lazy-loaded to reduce initial bundle size.

#### Scenario: Generator first paint
- **WHEN** user navigates directly to /generador
- **THEN** landing page code is not in critical path bundle

### Requirement: No business logic in UI folder
components/ui/ SHALL remain presentation-only; validation and formatting stay in services/.

### Requirement: Test coverage for v2 layout
Cutover SHALL include component tests for GeneratorPage, SidebarNav, ResizablePanels, and ExportMenu at minimum.
