# keyboard-shortcuts

## Purpose

Capability synced from change ux-redesign-general.


### Requirement: Core keyboard shortcuts
The application SHALL support keyboard shortcuts: Ctrl+S (save), Ctrl+Z (undo), Ctrl+Shift+Z (redo), Ctrl+P (export PDF), Ctrl+K (command palette), / (focus search), ? (shortcuts help).

#### Scenario: Save shortcut
- **WHEN** user presses Ctrl+S
- **THEN** form data is saved/persisted and footer updates

#### Scenario: Command palette shortcut
- **WHEN** user presses Ctrl+K
- **THEN** command palette modal opens

#### Scenario: Shortcuts help
- **WHEN** user presses ?
- **THEN** a panel listing all keyboard shortcuts is displayed

### Requirement: Shortcuts do not conflict with inputs
Keyboard shortcuts SHALL NOT trigger when focus is inside a text input or textarea, except Ctrl+S.

#### Scenario: Typing slash in input
- **WHEN** user types "/" in a text field
- **THEN** the search shortcut does not activate
