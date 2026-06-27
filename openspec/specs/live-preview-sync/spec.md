# live-preview-sync

## Purpose

Capability synced from change resizable-panels-live-preview.


### Requirement: Instant form-to-preview sync
In preview editor mode, every form field change SHALL reflect in the document preview without user action within one React render cycle.

#### Scenario: Text field update
- **WHEN** user types in any text field of the active form section
- **THEN** the corresponding text in the preview updates immediately

#### Scenario: Select and date fields
- **WHEN** user changes a select or date field
- **THEN** the preview reflects the new value immediately

#### Scenario: List fields
- **WHEN** user adds, edits, or removes a project or strength
- **THEN** the preview list section updates immediately

### Requirement: All editable form fields mapped to preview
Every field editable in UX v2 form sections SHALL appear in the preview (value or `[placeholder]` if empty).

#### Scenario: New section fields visible
- **WHEN** user fills fortalezas or evaluación sections
- **THEN** preview shows the content in the appropriate document area

### Requirement: No false pending state
The preview panel SHALL NOT display a "pending changes" indicator when form and preview are synchronized.

#### Scenario: After form edit
- **WHEN** user edits a form field in preview mode
- **THEN** no stale "changes pending" badge remains visible

## MODIFIED Requirements

### Requirement: Preview panel controls
The right panel SHALL include zoom control, page navigation, change indicator, and center document button.

#### Scenario: Live update
- **WHEN** user edits a form field in preview editor mode
- **THEN** preview reflects the change on the same render frame without manual refresh

#### Scenario: Change indicator removed when synced
- **WHEN** form data and preview are in sync
- **THEN** no misleading unsaved preview indicator is shown
