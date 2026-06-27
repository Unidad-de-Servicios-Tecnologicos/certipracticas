# History API Design (Future)

Based on existing `schemaHistory` in `useFormStore`.

## Undo / Redo

```typescript
interface HistoryEntry {
  letter: Letter;
  signature: SignatureData | null;
  textOverrides: Record<string, string>;
  timestamp: number;
}

interface FormHistory {
  past: HistoryEntry[];
  future: HistoryEntry[];
  push(entry: HistoryEntry): void;
  undo(): HistoryEntry | null;
  redo(): HistoryEntry | null;
}
```

## Keyboard

- `Ctrl+Z` → `undo()` on form history (canvas uses existing `undoCanvas`)
- `Ctrl+Shift+Z` → `redo()`

## Version restore

List last N entries from `past`; selecting one replaces current form state.

## Constraints

- Max 50 entries (match `MAX_HISTORY` for canvas)
- Debounce pushes (500ms) to avoid one entry per keystroke
- Do not change persist schema until implementation phase
