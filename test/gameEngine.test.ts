import { describe, it, expect } from "vitest";
import {
  getTemperatureTier,
  getDirection,
  calculateGuess,
  createGame,
  makeGuess,
  isValidEmoji,
} from "../src/core/gameEngine";
import type { EmojiVectors } from "../src/types";

// Mock vectors for testing
// Using simple vectors where similarity can be calculated predictably
const mockVectors: EmojiVectors = {
  // Identical vectors (100% similarity)
  "🌮": [1, 0, 0, 0],
  // Very similar to taco (food-related mock)
  "🍕": [0.9, 0.1, 0, 0],
  // Moderately similar
  "🍎": [0.6, 0.4, 0, 0],
  // Less similar
  "🚗": [0.3, 0.3, 0.4, 0],
  // Very different
  "🎸": [0, 0, 0, 1],
};

describe("getTemperatureTier", () => {
  it("returns PERFECT for score of 100", () => {
    expect(getTemperatureTier(100)).toBe("PERFECT");
  });

  it("returns BOILING for scores 80-99", () => {
    expect(getTemperatureTier(80)).toBe("BOILING");
    expect(getTemperatureTier(99)).toBe("BOILING");
  });

  it("returns HOT for scores 60-79", () => {
    expect(getTemperatureTier(60)).toBe("HOT");
    expect(getTemperatureTier(79)).toBe("HOT");
  });

  it("returns WARM for scores 40-59", () => {
    expect(getTemperatureTier(40)).toBe("WARM");
    expect(getTemperatureTier(59)).toBe("WARM");
  });

  it("returns COOL for scores 20-39", () => {
    expect(getTemperatureTier(20)).toBe("COOL");
    expect(getTemperatureTier(39)).toBe("COOL");
  });

  it("returns COLD for scores 10-19", () => {
    expect(getTemperatureTier(10)).toBe("COLD");
    expect(getTemperatureTier(19)).toBe("COLD");
  });

  it("returns FREEZING for scores 0-9", () => {
    expect(getTemperatureTier(0)).toBe("FREEZING");
    expect(getTemperatureTier(9)).toBe("FREEZING");
  });
});

describe("getDirection", () => {
  it("returns FIRST when there is no previous score", () => {
    expect(getDirection(50, null)).toBe("FIRST");
  });

  it("returns WARMER when current score is higher", () => {
    expect(getDirection(60, 50)).toBe("WARMER");
  });

  it("returns COLDER when current score is lower", () => {
    expect(getDirection(40, 50)).toBe("COLDER");
  });

  it("returns SAME when scores are equal", () => {
    expect(getDirection(50, 50)).toBe("SAME");
  });
});

describe("calculateGuess", () => {
  it("calculates correct score for identical emojis", () => {
    const result = calculateGuess("🌮", "🌮", mockVectors);
    expect(result.score).toBe(100);
    expect(result.temperature).toBe("PERFECT");
    expect(result.isCorrect).toBe(true);
  });

  it("calculates high score for similar emojis", () => {
    const result = calculateGuess("🍕", "🌮", mockVectors);
    expect(result.score).toBeGreaterThan(80);
    expect(result.isCorrect).toBe(false);
  });

  it("calculates low score for different emojis", () => {
    const result = calculateGuess("🎸", "🌮", mockVectors);
    expect(result.score).toBeLessThan(20);
  });

  it("returns FIRST direction on first guess", () => {
    const result = calculateGuess("🍕", "🌮", mockVectors, null);
    expect(result.direction).toBe("FIRST");
  });

  it("returns WARMER when score improves", () => {
    const result = calculateGuess("🍕", "🌮", mockVectors, 50);
    expect(result.direction).toBe("WARMER");
  });

  it("throws error for invalid emoji", () => {
    expect(() => calculateGuess("🦄", "🌮", mockVectors)).toThrow(
      "Emoji not found in vectors"
    );
  });
});

describe("createGame", () => {
  it("creates a new game with default settings", () => {
    const game = createGame("🌮", "2024-01-01");
    expect(game.targetEmoji).toBe("🌮");
    expect(game.guesses).toHaveLength(0);
    expect(game.isComplete).toBe(false);
    expect(game.isWon).toBe(false);
    expect(game.maxGuesses).toBe(8);
    expect(game.gameDate).toBe("2024-01-01");
  });

  it("creates a game with custom max guesses", () => {
    const game = createGame("🌮", "2024-01-01", 5);
    expect(game.maxGuesses).toBe(5);
  });
});

describe("makeGuess", () => {
  it("adds guess to game state", () => {
    const game = createGame("🌮", "2024-01-01");
    const { gameState } = makeGuess(game, "🍕", mockVectors);

    expect(gameState.guesses).toHaveLength(1);
    expect(gameState.guesses[0].emoji).toBe("🍕");
  });

  it("marks game as won when correct emoji is guessed", () => {
    const game = createGame("🌮", "2024-01-01");
    const { gameState, result } = makeGuess(game, "🌮", mockVectors);

    expect(gameState.isComplete).toBe(true);
    expect(gameState.isWon).toBe(true);
    expect(result.isCorrect).toBe(true);
  });

  it("marks game as complete when max guesses reached", () => {
    let game = createGame("🌮", "2024-01-01", 2);

    const result1 = makeGuess(game, "🍕", mockVectors);
    game = result1.gameState;
    expect(game.isComplete).toBe(false);

    const result2 = makeGuess(game, "🍎", mockVectors);
    game = result2.gameState;
    expect(game.isComplete).toBe(true);
    expect(game.isWon).toBe(false);
  });

  it("tracks direction relative to previous guess", () => {
    let game = createGame("🌮", "2024-01-01");

    // First guess - should be FIRST
    const { gameState: state1, result: result1 } = makeGuess(
      game,
      "🎸",
      mockVectors
    );
    expect(result1.direction).toBe("FIRST");

    // Second guess with higher score - should be WARMER
    const { result: result2 } = makeGuess(state1, "🍕", mockVectors);
    expect(result2.direction).toBe("WARMER");
  });

  it("throws error if game is already complete", () => {
    const game = createGame("🌮", "2024-01-01");
    const { gameState } = makeGuess(game, "🌮", mockVectors);

    expect(() => makeGuess(gameState, "🍕", mockVectors)).toThrow(
      "Game is already complete"
    );
  });
});

describe("isValidEmoji", () => {
  it("returns true for valid emoji", () => {
    expect(isValidEmoji("🌮", mockVectors)).toBe(true);
  });

  it("returns false for invalid emoji", () => {
    expect(isValidEmoji("🦄", mockVectors)).toBe(false);
  });
});
