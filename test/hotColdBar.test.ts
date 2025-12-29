import { describe, it, expect } from "vitest";
import { getHotColdBarState } from "../src/utils/hotColdBar";
import type { GameState, GuessResult, Guess } from "../src/types";

// Helper to create a minimal game state
function createGameState(guesses: Guess[] = []): GameState {
  return {
    targetEmoji: "🎯",
    guesses,
    isComplete: false,
    isWon: false,
    maxGuesses: 8,
    gameDate: "2024-01-01",
  };
}

// Helper to create a guess
function createGuess(emoji: string, score: number): Guess {
  return {
    emoji,
    score,
    temperature: score >= 80 ? "BOILING" : score >= 60 ? "HOT" : "WARM",
    direction: "FIRST",
    categoryMatch: false,
    timestamp: Date.now(),
  };
}

// Helper to create a guess result
function createGuessResult(isCorrect: boolean, score: number = 50): GuessResult {
  return {
    emoji: "🔥",
    score,
    temperature: "WARM",
    direction: "FIRST",
    isCorrect,
    categoryMatch: false,
  };
}

describe("getHotColdBarState", () => {
  describe("initial state (no guesses)", () => {
    it("returns default state when gameState is null", () => {
      const result = getHotColdBarState(null, null);

      expect(result.currentEmoji).toBeNull();
      expect(result.position).toBe(0);
      expect(result.isCorrect).toBe(false);
      expect(result.hasGuesses).toBe(false);
    });

    it("returns default state when guesses array is empty", () => {
      const gameState = createGameState([]);
      const result = getHotColdBarState(gameState, null);

      expect(result.currentEmoji).toBeNull();
      expect(result.position).toBe(0);
      expect(result.isCorrect).toBe(false);
      expect(result.hasGuesses).toBe(false);
    });
  });

  describe("with guesses", () => {
    it("returns the latest guess emoji", () => {
      const guesses = [createGuess("🌮", 30), createGuess("🍕", 50)];
      const gameState = createGameState(guesses);
      const result = getHotColdBarState(gameState, null);

      expect(result.currentEmoji).toBe("🍕");
      expect(result.hasGuesses).toBe(true);
    });

    it("returns position based on latest guess score", () => {
      const guesses = [createGuess("🌮", 30), createGuess("🍕", 75)];
      const gameState = createGameState(guesses);
      const result = getHotColdBarState(gameState, null);

      expect(result.position).toBe(75);
    });

    it("handles single guess", () => {
      const guesses = [createGuess("🎸", 42)];
      const gameState = createGameState(guesses);
      const result = getHotColdBarState(gameState, null);

      expect(result.currentEmoji).toBe("🎸");
      expect(result.position).toBe(42);
      expect(result.hasGuesses).toBe(true);
    });
  });

  describe("position mapping", () => {
    it("maps score 0 to position 0 (far left)", () => {
      const guesses = [createGuess("❄️", 0)];
      const gameState = createGameState(guesses);
      const result = getHotColdBarState(gameState, null);

      expect(result.position).toBe(0);
    });

    it("maps score 50 to position 50 (middle)", () => {
      const guesses = [createGuess("🌡️", 50)];
      const gameState = createGameState(guesses);
      const result = getHotColdBarState(gameState, null);

      expect(result.position).toBe(50);
    });

    it("maps score 100 to position 100 (at mystery box)", () => {
      const guesses = [createGuess("🔥", 100)];
      const gameState = createGameState(guesses);
      const result = getHotColdBarState(gameState, null);

      expect(result.position).toBe(100);
    });
  });

  describe("correct answer state", () => {
    it("returns isCorrect true when lastGuessResult indicates correct", () => {
      const guesses = [createGuess("🎯", 100)];
      const gameState = createGameState(guesses);
      const guessResult = createGuessResult(true, 100);
      const result = getHotColdBarState(gameState, guessResult);

      expect(result.isCorrect).toBe(true);
      expect(result.position).toBe(100);
    });

    it("returns isCorrect false when lastGuessResult indicates incorrect", () => {
      const guesses = [createGuess("🍕", 85)];
      const gameState = createGameState(guesses);
      const guessResult = createGuessResult(false, 85);
      const result = getHotColdBarState(gameState, guessResult);

      expect(result.isCorrect).toBe(false);
    });

    it("returns isCorrect false when lastGuessResult is null", () => {
      const guesses = [createGuess("🍕", 85)];
      const gameState = createGameState(guesses);
      const result = getHotColdBarState(gameState, null);

      expect(result.isCorrect).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("handles many guesses and returns only the latest", () => {
      const guesses = [
        createGuess("1️⃣", 10),
        createGuess("2️⃣", 20),
        createGuess("3️⃣", 30),
        createGuess("4️⃣", 40),
        createGuess("5️⃣", 50),
        createGuess("6️⃣", 60),
        createGuess("7️⃣", 70),
        createGuess("8️⃣", 80),
      ];
      const gameState = createGameState(guesses);
      const result = getHotColdBarState(gameState, null);

      expect(result.currentEmoji).toBe("8️⃣");
      expect(result.position).toBe(80);
    });

    it("handles gameState with null lastGuessResult for correct state", () => {
      const guesses = [createGuess("🎯", 100)];
      const gameState = createGameState(guesses);
      // Even if score is 100, isCorrect comes from lastGuessResult
      const result = getHotColdBarState(gameState, null);

      expect(result.isCorrect).toBe(false);
      expect(result.position).toBe(100);
    });
  });
});
