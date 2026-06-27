# contextual-help

## Purpose

Capability synced from change ux-redesign-general.


### Requirement: Field tooltips
Complex or non-obvious form fields SHALL display tooltips on hover or focus explaining their purpose.

#### Scenario: Tooltip on hover
- **WHEN** user hovers over a field with a tooltip
- **THEN** a brief explanation appears without blocking interaction

### Requirement: Inline hints
Form sections SHALL include inline hint text below field groups where additional context is needed.

#### Scenario: Section hint visible
- **WHEN** user views a section with hints configured
- **THEN** hint text appears below the section description

### Requirement: Non-invasive help
Contextual help SHALL NOT use blocking modal dialogs except for onboarding.

#### Scenario: Help does not block
- **WHEN** user accesses contextual help via tooltip or hint
- **THEN** no full-screen modal appears
