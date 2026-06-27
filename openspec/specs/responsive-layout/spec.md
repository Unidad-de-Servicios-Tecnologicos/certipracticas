# responsive-layout

## Purpose

Capability synced from change ux-redesign-general.


### Requirement: Mobile tab layout
On viewports <768px, the application SHALL use a tab-based layout switching between Formulario and Preview instead of side-by-side columns.

#### Scenario: Mobile tabs
- **WHEN** user opens generator on viewport <768px
- **THEN** tabs for "Formulario" and "Preview" are displayed

#### Scenario: Tab switch preserves state
- **WHEN** user switches between Formulario and Preview tabs
- **THEN** form data and preview state are preserved

### Requirement: Mobile section carousel
On mobile, section navigation SHALL use a bottom carousel showing current section with prev/next arrows.

#### Scenario: Section navigation on mobile
- **WHEN** user taps next arrow on mobile
- **THEN** next form section loads with section name displayed

### Requirement: Tablet adapted layout
On viewports 768px–1023px, the application SHALL show sidebar collapsed to icons with expandable labels, maintaining preview visibility.

#### Scenario: Tablet sidebar collapsed
- **WHEN** user opens generator on tablet viewport
- **THEN** sidebar shows icons only with tooltip labels on hover
