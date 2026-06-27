# progress-indicator

## Purpose

Capability synced from change ux-redesign-general.


### Requirement: Global progress bar
The application SHALL display a progress indicator showing overall form completion percentage.

#### Scenario: Progress updates on field change
- **WHEN** user completes a required field
- **THEN** progress percentage increases accordingly

#### Scenario: Progress reflects validation state
- **WHEN** all required fields in all sections are valid
- **THEN** progress shows 100%

### Requirement: Section completion summary
The progress area SHALL indicate count of completed sections, pending sections, and sections with errors.

#### Scenario: Pending sections listed
- **WHEN** user has incomplete sections
- **THEN** progress area shows how many sections remain pending

#### Scenario: Error count visible
- **WHEN** validation errors exist
- **THEN** progress area shows total error count with link to first error section
