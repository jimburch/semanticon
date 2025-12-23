# Guessing Flow Implementation

## Overview

The guessing flow allows users to select an emoji from the keyboard and confirm their guess. The flow is:

1. User browses/searches emojis in the keyboard
2. User taps an emoji to select it
3. Confirm button updates to show "Confirm: [emoji]"
4. User taps confirm to submit the guess
5. Selection clears, result displays in GuessGrid

## State Management

### Game Store Additions

Added to `src/store/gameStore.ts`:

**New State:**

- `selectedEmoji: string | null` - Currently selected emoji awaiting confirmation

**New Actions:**

- `selectEmoji(emoji: string | null)` - Set the selected emoji
- `confirmGuess()` - Validate and submit the selected emoji as a guess

### Confirm Guess Flow

```
selectEmoji(emoji) → confirmGuess() → makeGuess(emoji) → clear selection
```

The `confirmGuess` action:

1. Validates an emoji is selected
2. Checks if game is initialized and not complete
3. Validates emoji exists in vector file
4. Calls `makeGuess` to submit
5. Clears selection on success

## Components

### ConfirmGuess (`src/components/ConfirmGuess/`)

A button component that displays the selected emoji and allows confirmation.

**States:**

- **No selection**: Disabled, shows "Select an emoji to guess"
- **Emoji selected**: Enabled, shows "Confirm: [emoji]"
- **Game complete**: Disabled
- **Error**: Shows error message (e.g., invalid emoji)

**Props:** None (uses Zustand store directly)

### EmojiKeyboard Updates

Connected to game store via `onEmojiSelect` callback:

```tsx
const handleEmojiSelect = ({ emoji }) => {
  selectEmoji(emoji);
};

<EmojiPicker.Root onEmojiSelect={handleEmojiSelect}>
```

## File Structure

```
src/
├── components/
│   ├── ConfirmGuess/
│   │   ├── ConfirmGuess.tsx        # Main component
│   │   ├── ConfirmGuess.module.css # Styles
│   │   └── index.ts                # Barrel export
│   └── EmojiKeyboard/
│       └── EmojiKeyboard.tsx       # Updated with selection handler
└── store/
    └── gameStore.ts                # Added selectedEmoji state
```

## Error Handling

Invalid emojis (not in vector file) can be selected but show an error on confirm:

- "This emoji isn't in today's game"

Other errors:

- "No emoji selected" - Confirm clicked without selection
- "Game not initialized" - Vectors not loaded
- "Game is already complete" - All guesses used or won

## Styling

The confirm button uses the app's design tokens:

- Green (`--color-correct`) when enabled
- Gray (`--color-absent`) when disabled
- Yellow (`--color-present`) for error messages
