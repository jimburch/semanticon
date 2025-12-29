import type { GameState, GuessResult } from "../types";

export interface HotColdBarState {
  /** The emoji to display on the bar (null if no guesses yet) */
  currentEmoji: string | null;
  /** Position as percentage (0-100), where 0 is far left and 100 is at the mystery box */
  position: number;
  /** Whether the current guess is correct */
  isCorrect: boolean;
  /** Whether there are any guesses to display */
  hasGuesses: boolean;
}

/**
 * Derives the hot/cold bar display state from game state
 */
export function getHotColdBarState(
  gameState: GameState | null,
  lastGuessResult: GuessResult | null
): HotColdBarState {
  const guesses = gameState?.guesses ?? [];
  const latestGuess = guesses.length > 0 ? guesses[guesses.length - 1] : null;
  const isCorrect = lastGuessResult?.isCorrect ?? false;

  return {
    currentEmoji: latestGuess?.emoji ?? null,
    position: latestGuess?.score ?? 0,
    isCorrect,
    hasGuesses: guesses.length > 0,
  };
}
