# form-navigation

## Purpose

Capability synced from change ux-redesign-general.


### Requirement: Sidebar section navigation
The application SHALL display form sections as a vertical navigation list in the left sidebar with icons, labels, completion status, and error indicators.

#### Scenario: Section list displays all groups
- **WHEN** user opens the generator
- **THEN** sidebar shows sections: General, Empresa, Aprendiz, Supervisor, Actividades, Fortalezas, Evaluación, Firma, Logos, IA, Configuración

#### Scenario: Active section highlighted
- **WHEN** user selects a section in the sidebar
- **THEN** that section is visually highlighted and its form fields render in the central area

#### Scenario: Section with errors shows indicator
- **WHEN** a section contains validation errors
- **THEN** sidebar shows an error badge on that section

### Requirement: Single section visible at a time
The central area SHALL render only the form fields belonging to the currently active section.

#### Scenario: One section rendered
- **WHEN** user navigates to "Aprendiz" section
- **THEN** only Aprendiz fields are visible in the central area

#### Scenario: Section has title and description
- **WHEN** a section is displayed
- **THEN** it shows a title and brief description explaining the section purpose

### Requirement: Section next/previous navigation
The central area SHALL provide Previous and Next buttons to navigate between sections sequentially.

#### Scenario: Navigate to next section
- **WHEN** user clicks "Siguiente" on the last field of a section
- **THEN** the next section in order becomes active

#### Scenario: First section disables previous
- **WHEN** user is on the first section
- **THEN** the Previous button is disabled
