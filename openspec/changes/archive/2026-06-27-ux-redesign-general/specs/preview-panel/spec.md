## ADDED Requirements

### Requirement: Preview panel controls
The right panel SHALL include zoom control, page navigation, change indicator, and center document button.

#### Scenario: Zoom control
- **WHEN** user adjusts zoom in the preview panel
- **THEN** document preview scales accordingly from 50% to 200%

#### Scenario: Page navigation
- **WHEN** document has multiple pages
- **THEN** preview panel shows current page number and prev/next controls

#### Scenario: Center document
- **WHEN** user clicks "Centrar"
- **THEN** preview scrolls to center the document in the panel

#### Scenario: Change indicator
- **WHEN** form data changes since last preview render
- **THEN** a visual indicator shows unsaved preview changes

### Requirement: Real-time preview
The preview panel SHALL update reactively as form data changes without requiring manual refresh.

#### Scenario: Live update
- **WHEN** user edits a form field
- **THEN** preview reflects the change within 500ms
