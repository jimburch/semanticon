# State Management

Semanticon uses **Zustand** for state management.

## Why Zustand over Jotai?

1. **Framework-agnostic**: Works both in React components and vanilla TypeScript (game engine)
2. **Built-in persistence**: `persist` middleware for localStorage integration
3. **Simple API**: Single store pattern fits the `GameState` structure
4. **Lightweight**: ~1KB gzipped

## Stores

### Game Store (`src/store/gameStore.ts`)

Manages the current game session state.

**State:**
- `gameState` - Current `GameState` object (target emoji, guesses, completion status)
- `vectors` - Loaded emoji vectors for similarity calculations
- `lastGuessResult` - Result of the most recent guess

**Actions:**
- `initGame(targetEmoji, gameDate, maxGuesses?)` - Start a new game
- `setVectors(vectors)` - Load emoji vectors
- `makeGuess(emoji)` - Submit a guess, returns `GuessResult`
- `resetGame()` - Clear game state
- `isValidGuess(emoji)` - Check if emoji exists in vectors

**Usage in React:**
```tsx
import { useGameStore } from '../store';

function GameComponent() {
  const { gameState, makeGuess, initGame } = useGameStore();
  // ...
}
```

**Usage in vanilla TS (game engine):**
```ts
import { gameStore } from '../store';

// Access current state
const state = gameStore.getState();

// Subscribe to changes
const unsubscribe = gameStore.subscribe((state) => {
  console.log('State changed:', state);
});
```

### User Stats Store (`src/store/userStatsStore.ts`)

Tracks user statistics with automatic localStorage persistence.

**State (persisted):**
- `gamesPlayed` - Total games played
- `gamesWon` - Total games won
- `currentStreak` - Current win streak
- `maxStreak` - Best win streak
- `guessDistribution` - Wins per guess count
- `lastPlayedDate` - Last game date (ISO format)

**Actions:**
- `recordGameResult(won, guessCount, gameDate)` - Record a completed game
- `resetStats()` - Clear all statistics

**Automatic Persistence:**
Stats are automatically saved to localStorage under the key `semanticon-user-stats`.

**Usage:**
```tsx
import { useUserStatsStore } from '../store';

function StatsComponent() {
  const { gamesPlayed, gamesWon, currentStreak, maxStreak } = useUserStatsStore();

  const winRate = gamesPlayed > 0 ? (gamesWon / gamesPlayed * 100).toFixed(1) : 0;
  // ...
}
```

## File Structure

```
src/store/
├── index.ts           # Exports all stores
├── gameStore.ts       # Current game state
└── userStatsStore.ts  # User statistics (persisted)
```
