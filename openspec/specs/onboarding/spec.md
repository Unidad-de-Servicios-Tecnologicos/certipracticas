# onboarding

## Purpose

Capability synced from change ux-redesign-general.


### Requirement: First-time onboarding tour
The application SHALL show an onboarding tour on the user's first visit to the generator, explaining form sections, AI, export, and customization.

#### Scenario: Onboarding on first visit
- **WHEN** user opens the generator for the first time
- **THEN** onboarding tour starts automatically

#### Scenario: Skip onboarding
- **WHEN** user clicks "Omitir" during onboarding
- **THEN** tour closes and does not show again

#### Scenario: Onboarding not repeated
- **WHEN** user has completed or skipped onboarding
- **THEN** onboarding does not appear on subsequent visits

### Requirement: Onboarding covers key workflows
The onboarding tour SHALL include at least four steps: form sections, AI generation, export, and document customization.

#### Scenario: Four step minimum
- **WHEN** onboarding tour is active
- **THEN** user can navigate through at least 4 explanatory steps
