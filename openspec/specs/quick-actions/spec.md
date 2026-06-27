# quick-actions

## Purpose

Capability synced from change ux-redesign-general.


### Requirement: Quick actions in header
The header SHALL provide one-click access to the most frequent actions: save, export PDF, export DOCX, duplicate, import, and settings.

#### Scenario: Export PDF from header
- **WHEN** user clicks Export PDF in the header
- **THEN** PDF export begins without navigating away

#### Scenario: Import document
- **WHEN** user clicks Import in the header
- **THEN** a file picker opens for JSON import

### Requirement: Export dropdown groups formats
The export action in the header SHALL offer PDF, DOCX, and JSON in a dropdown menu.

#### Scenario: Export menu options
- **WHEN** user opens the export dropdown
- **THEN** PDF, DOCX, and JSON options are listed
