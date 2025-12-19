# Game Engine & Testing

## Overview

The game engine handles all core logic for Semanticon, including:

- Calculating similarity scores between emoji guesses and the target
- Providing temperature-based feedback (FREEZING → PERFECT)
- Tracking warmer/colder direction relative to previous guesses
- Managing game state (guesses, win/lose status)

## File Structure

```
src/
├── types/index.ts           # TypeScript type definitions
├── core/
│   ├── vectorCalculator.ts  # Cosine similarity math
│   └── gameEngine.ts        # Main game logic
└── utils/
    └── emoji.ts             # Emoji normalization utilities

test/
├── vectorCalculator.test.ts # Vector math tests
├── gameEngine.test.ts       # Game logic tests
└── emoji.test.ts            # Emoji utility tests
```

## How the Engine Works

### 1. Vector Similarity

Emojis are represented as vectors (arrays of numbers) generated from OpenAI embeddings. The similarity between two emojis is calculated using **cosine similarity**:

```
similarity = (A · B) / (|A| × |B|)
```

This returns a value between -1 and 1, which is converted to a 0-100% score.

### 2. Temperature Tiers (Absolute Feedback)

Based on the score, the game assigns a temperature tier:

| Score     | Tier      |
|-----------|-----------|
| 100       | PERFECT   |
| 80-99     | BOILING   |
| 60-79     | HOT       |
| 40-59     | WARM      |
| 20-39     | COOL      |
| 10-19     | COLD      |
| 0-9       | FREEZING  |

### 3. Direction (Relative Feedback)

Each guess is compared to the previous guess's score:

| Condition                    | Direction |
|------------------------------|-----------|
| First guess                  | FIRST     |
| Current score > previous     | WARMER    |
| Current score < previous     | COLDER    |
| Current score = previous     | SAME      |

### 4. Game State

The engine tracks full game state:

```typescript
interface GameState {
  targetEmoji: string;      // The emoji to guess
  guesses: Guess[];         // All guesses with scores/feedback
  isComplete: boolean;      // Game ended (win or max guesses)
  isWon: boolean;           // Player guessed correctly
  maxGuesses: number;       // Default: 8
  gameDate: string;         // For daily challenge tracking
}
```

## Core Functions

### `calculateGuess(guessEmoji, targetEmoji, vectors, previousScore?)`

Calculates the result of a single guess without modifying state.

Returns:
```typescript
{
  emoji: string;
  score: number;           // 0-100
  temperature: TemperatureTier;
  direction: Direction;
  isCorrect: boolean;
}
```

### `createGame(targetEmoji, gameDate, maxGuesses?)`

Creates a new game state with the target emoji.

### `makeGuess(gameState, guessEmoji, vectors)`

Processes a guess and returns updated game state + result. Handles:
- Adding guess to history
- Comparing to previous guess for direction
- Checking win condition (correct emoji)
- Checking loss condition (max guesses reached)

### `isValidEmoji(emoji, vectors)`

Checks if an emoji exists in the vectors data.

## Emoji Normalization

Some emojis have variation selectors (U+FE0F) that can cause mismatches. The `normalizeEmoji()` function strips these to ensure consistent matching against the vectors data.

```typescript
normalizeEmoji("⚾️")  // Removes FE0F variation selector
```

## Testing

### Run Tests

```bash
# Watch mode (re-runs on file changes)
npm test

# Single run
npm run test:run
```

### Test Coverage

- **vectorCalculator.test.ts** (10 tests)
  - Cosine similarity edge cases (identical, orthogonal, opposite vectors)
  - Score conversion and rounding

- **gameEngine.test.ts** (26 tests)
  - Temperature tier thresholds
  - Direction calculation
  - Full game flow (create → guess → win/lose)
  - Error handling (invalid emoji, game already complete)

- **emoji.test.ts** (6 tests)
  - Variation selector removal
  - Emoji detection

### Writing New Tests

Tests use mock vectors for predictability:

```typescript
const mockVectors: EmojiVectors = {
  "🌮": [1, 0, 0, 0],
  "🍕": [0.9, 0.1, 0, 0],  // Similar to taco
  "🎸": [0, 0, 0, 1],      // Very different
};
```

This allows testing specific similarity scenarios without loading the full 3.8MB vectors file.

## Usage Example

```typescript
import { createGame, makeGuess } from "./core/gameEngine";
import vectors from "./data/emoji-vectors.json";

// Start a new game
let game = createGame("🌮", "2024-01-15");

// Make guesses
const { gameState, result } = makeGuess(game, "🍕", vectors);

console.log(result.score);       // e.g., 72
console.log(result.temperature); // "HOT"
console.log(result.direction);   // "FIRST"

// Continue playing...
const { gameState: state2, result: result2 } = makeGuess(gameState, "🌯", vectors);
console.log(result2.direction);  // "WARMER" or "COLDER"
```
