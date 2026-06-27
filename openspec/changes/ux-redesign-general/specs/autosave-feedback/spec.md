## ADDED Requirements

### Requirement: Persistent autosave indicator
The application SHALL always display the current autosave state in the footer status bar.

#### Scenario: Saving state
- **WHEN** form data is being persisted
- **THEN** footer shows "Guardando..."

#### Scenario: Saved state
- **WHEN** data has been successfully persisted
- **THEN** footer shows "Guardado hace X segundos"

#### Scenario: No changes state
- **WHEN** no changes have been made since last save
- **THEN** footer shows "Sin cambios"

#### Scenario: Save error state
- **WHEN** persistence fails
- **THEN** footer shows "Error al guardar" with retry action

### Requirement: Action feedback toasts
Every significant user action SHALL produce immediate visual feedback via toast notifications.

#### Scenario: Export success
- **WHEN** document export completes successfully
- **THEN** a success toast confirms the export format and filename

#### Scenario: AI generation complete
- **WHEN** AI content generation finishes
- **THEN** a toast confirms content was generated

#### Scenario: Error feedback
- **WHEN** an action fails
- **THEN** an error toast explains what went wrong in plain language
