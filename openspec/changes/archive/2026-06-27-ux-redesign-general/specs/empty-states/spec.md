## ADDED Requirements

### Requirement: Empty state for new document
When no form data exists, the central area SHALL display an empty state explaining how to begin.

#### Scenario: New document empty state
- **WHEN** user creates a new document with empty form
- **THEN** empty state shows options to start filling, load example, or import

### Requirement: Empty state for list sections
Sections with list content (Actividades, Fortalezas, Logos) SHALL show an empty state when the list is empty.

#### Scenario: Empty activities
- **WHEN** projects/activities list is empty
- **THEN** empty state explains how to add manually or generate with AI

#### Scenario: Empty signature
- **WHEN** no signature has been drawn or uploaded
- **THEN** empty state prompts user to draw or upload a signature

### Requirement: Empty states are actionable
Each empty state SHALL include at least one primary action button.

#### Scenario: Empty state action
- **WHEN** user views an empty state
- **THEN** at least one button allows the user to take the suggested action
