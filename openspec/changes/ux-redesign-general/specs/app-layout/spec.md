## ADDED Requirements

### Requirement: Three-column desktop layout
The application SHALL render a three-column layout on viewports ≥1024px: sidebar (navigation), central area (active form section), and right panel (document preview).

#### Scenario: Desktop layout renders
- **WHEN** user opens the generator on a viewport ≥1024px
- **THEN** sidebar, form area, and preview panel are visible simultaneously

#### Scenario: Sidebar has fixed width
- **WHEN** desktop layout is active
- **THEN** sidebar width is 240px and does not shrink below 200px

### Requirement: Minimal global header
The header SHALL contain only: logo, application name, new document, save, export (dropdown), settings, and theme toggle.

#### Scenario: Header actions visible
- **WHEN** user is on the generator page
- **THEN** all global actions are accessible from the header without scrolling

#### Scenario: Header does not contain form fields
- **WHEN** user views the header
- **THEN** no form input fields appear in the header area

### Requirement: Persistent footer status bar
The application SHALL display a footer bar showing autosave status and keyboard shortcut hint.

#### Scenario: Autosave status in footer
- **WHEN** form data changes
- **THEN** footer shows current save state (saving, saved, no changes, or error)
