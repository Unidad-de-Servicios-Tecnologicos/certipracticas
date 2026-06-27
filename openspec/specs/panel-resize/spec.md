# panel-resize

## Purpose

Capability synced from change resizable-panels-live-preview.


### Requirement: Draggable split between form and preview
On viewports ≥1024px, the application SHALL provide a draggable vertical divider between the form area and the preview panel.

#### Scenario: User drags divider
- **WHEN** user drags the divider horizontally
- **THEN** form and preview panel widths update in real time

#### Scenario: Minimum widths enforced
- **WHEN** user drags divider below minimum width
- **THEN** divider stops at minimum (form ≥280px, preview ≥320px)

### Requirement: Persist panel ratio
The application SHALL persist the form/preview width ratio in localStorage and restore it on next visit.

#### Scenario: Ratio restored on reload
- **WHEN** user reloads the page after resizing panels
- **THEN** panels restore to the last saved ratio

### Requirement: Touch support for resize
The draggable divider SHALL support touch drag on tablet devices.

#### Scenario: Touch drag on tablet
- **WHEN** user drags divider with touch on a tablet viewport
- **THEN** panel widths update same as mouse drag
