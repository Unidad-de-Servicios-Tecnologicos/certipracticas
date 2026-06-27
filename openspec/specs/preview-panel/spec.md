# preview-panel

## Purpose

Capability synced from change resizable-panels-live-preview.


### Requirement: Real-time preview
The preview panel SHALL update reactively as form data changes without requiring manual refresh.

#### Scenario: Live update on keystroke
- **WHEN** user types in the form while preview editor mode is active
- **THEN** preview content updates on each change with no debounce beyond React render

#### Scenario: Resizable preview area
- **WHEN** user resizes the form/preview split
- **THEN** preview re-layouts within the new panel width while maintaining zoom level
