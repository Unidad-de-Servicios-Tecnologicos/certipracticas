## ADDED Requirements

### Requirement: Section transition animations
Section changes SHALL animate with a smooth fade/slide transition lasting 200–300ms.

#### Scenario: Section change animation
- **WHEN** user navigates to a different section
- **THEN** outgoing section fades out and incoming section fades in

### Requirement: Save feedback animation
The autosave indicator SHALL animate briefly when transitioning to "saved" state.

#### Scenario: Save pulse
- **WHEN** save completes successfully
- **THEN** save indicator shows a brief confirmation animation

### Requirement: Export loading state
Export actions SHALL show a loading animation on the export button while processing.

#### Scenario: Export spinner
- **WHEN** export is in progress
- **THEN** export button shows spinner and is disabled

### Requirement: Animations respect reduced motion
All animations SHALL be disabled when user prefers reduced motion.

#### Scenario: Reduced motion preference
- **WHEN** user has prefers-reduced-motion enabled
- **THEN** all UI animations are skipped or instant
