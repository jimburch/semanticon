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

## Task 7C: Improved Game UI

### Overview

Enhanced the guessing UI with visual feedback for guess results and category matching.

### Changes Made

#### 1. Emoji Category System

Created `src/utils/emojiCategory.ts` to determine emoji categories using emojibase data:

- Fetches emoji data from the same CDN as frimousse (emojibase)
- Provides `isSameCategory(emoji1, emoji2)` function to compare categories
- Categories are based on emojibase groups (10 main categories like "smileys-emotion", "animals-nature", etc.)

#### 2. Updated Type Definitions

Added `categoryMatch: boolean` to both `GuessResult` and `Guess` types in `src/types/index.ts`.

#### 3. GuessGrid Improvements

The guess grid now shows:

- **Pending emoji**: Selected (but unconfirmed) emoji appears in the next empty slot
- **Color-coded backgrounds** after confirmation:
  - Light green (`--color-correct`): Correct guess
  - Light yellow (`--color-present`): Wrong guess but same category as answer
  - Light grey (`--color-absent`): Wrong guess and wrong category

#### 4. GuessFeedback Component

New component `src/components/GuessFeedback/` shows feedback after each guess:

- Displays similarity percentage (e.g., "45% similar")
- Shows "Warmer!" or "Colder" compared to previous guess
- For first guess, only shows percentage
- Shows "Correct!" when the answer is found

#### 5. HintIndicators Removed

- Removed the entire HintIndicators component (both "Color" and "Category" blocks)
- Category feedback is now conveyed through the colored guess tile backgrounds (yellow = same category)

#### 6. ConfirmGuess Button

- Removed emoji display from the button (emoji now shows in guess grid)
- Button simply shows "Confirm" when an emoji is selected

### Updated Data Flow

```
User selects emoji → selectedEmoji updates
  → GuessGrid shows pending emoji in next slot

User clicks Confirm → confirmGuess() validates
  → makeGuess() calculates score + categoryMatch
  → GuessGrid updates with colored tile (green/yellow/grey)
  → GuessFeedback shows percentage and direction
```

### File Structure (New/Modified)

```
src/
├── utils/
│   └── emojiCategory.ts           # NEW: Category lookup utility
├── components/
│   ├── GuessFeedback/             # NEW
│   │   ├── GuessFeedback.tsx
│   │   └── GuessFeedback.module.css
│   ├── GuessGrid/
│   │   ├── GuessGrid.tsx          # MODIFIED: Pending state + colors
│   │   └── GuessGrid.module.css   # MODIFIED: New color classes
│   └── ConfirmGuess/
│       ├── ConfirmGuess.tsx       # MODIFIED: No emoji in button
│       └── ConfirmGuess.module.css
├── types/
│   └── index.ts                   # MODIFIED: Added categoryMatch
├── core/
│   └── gameEngine.ts              # MODIFIED: Calculate categoryMatch
└── App.tsx                        # MODIFIED: Added GuessFeedback, load emojiData, removed HintIndicators
```

Note: HintIndicators component files still exist but are no longer used.
