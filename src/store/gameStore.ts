/**
 * Game store for managing current game state
 * Uses Zustand for state management
 */

import { create } from "zustand";
import type { GameState, GuessResult, EmojiVectors } from "../types";
import { createGame, makeGuess as makeGuessEngine, isValidEmoji } from "../core/gameEngine";

interface GameStore {
  // State
  gameState: GameState | null;
  vectors: EmojiVectors | null;
  lastGuessResult: GuessResult | null;
  selectedEmoji: string | null;

  // Actions
  initGame: (targetEmoji: string, gameDate: string, maxGuesses?: number) => void;
  setVectors: (vectors: EmojiVectors) => void;
  makeGuess: (emoji: string) => GuessResult | null;
  resetGame: () => void;
  isValidGuess: (emoji: string) => boolean;
  selectEmoji: (emoji: string | null) => void;
  confirmGuess: () => { success: boolean; error?: string };
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  gameState: null,
  vectors: null,
  lastGuessResult: null,
  selectedEmoji: null,

  // Initialize a new game
  initGame: (targetEmoji, gameDate, maxGuesses = 8) => {
    const newGameState = createGame(targetEmoji, gameDate, maxGuesses);
    set({
      gameState: newGameState,
      lastGuessResult: null,
    });
  },

  // Set the emoji vectors (loaded from JSON)
  setVectors: (vectors) => {
    set({ vectors });
  },

  // Make a guess and update state
  makeGuess: (emoji) => {
    const { gameState, vectors } = get();

    if (!gameState || !vectors) {
      console.error("Game not initialized or vectors not loaded");
      return null;
    }

    if (gameState.isComplete) {
      console.error("Game is already complete");
      return null;
    }

    try {
      const { gameState: newGameState, result } = makeGuessEngine(gameState, emoji, vectors);

      set({
        gameState: newGameState,
        lastGuessResult: result,
      });

      return result;
    } catch (error) {
      console.error("Error making guess:", error);
      return null;
    }
  },

  // Reset game state
  resetGame: () => {
    set({
      gameState: null,
      lastGuessResult: null,
    });
  },

  // Check if emoji is valid for guessing
  isValidGuess: (emoji) => {
    const { vectors } = get();
    if (!vectors) return false;
    return isValidEmoji(emoji, vectors);
  },

  // Select an emoji for guessing
  selectEmoji: (emoji) => {
    set({ selectedEmoji: emoji });
  },

  // Confirm the selected emoji as a guess
  confirmGuess: () => {
    const { selectedEmoji, gameState, vectors } = get();

    if (!selectedEmoji) {
      return { success: false, error: "No emoji selected" };
    }

    if (!gameState || !vectors) {
      return { success: false, error: "Game not initialized" };
    }

    if (gameState.isComplete) {
      return { success: false, error: "Game is already complete" };
    }

    // Check if emoji is valid
    if (!isValidEmoji(selectedEmoji, vectors)) {
      return { success: false, error: "This emoji isn't in today's game" };
    }

    // Make the guess
    const result = get().makeGuess(selectedEmoji);

    if (result) {
      // Clear selection after successful guess
      set({ selectedEmoji: null });
      return { success: true };
    }

    return { success: false, error: "Failed to submit guess" };
  },
}));

// Vanilla (non-React) access to the store
export const gameStore = useGameStore;
