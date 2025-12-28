/**
 * Game engine for Semanticon
 * Handles game logic, scoring, and state management
 */

import type {
  EmojiVectors,
  TemperatureTier,
  Direction,
  GuessResult,
  Guess,
  GameState,
} from "../types";
import { cosineSimilarity, similarityToScore } from "./vectorCalculator";
import { normalizeEmoji } from "../utils/emoji";
import { isSameCategory } from "../utils/emojiCategory";

// Default thresholds for temperature tiers
const TEMPERATURE_THRESHOLDS = {
  PERFECT: 100,
  BOILING: 80,
  HOT: 60,
  WARM: 40,
  COOL: 20,
  COLD: 10,
  FREEZING: 0,
} as const;

// Default max guesses
const DEFAULT_MAX_GUESSES = 8;

/**
 * Get temperature tier based on score
 */
export const getTemperatureTier = (score: number): TemperatureTier => {
  if (score >= TEMPERATURE_THRESHOLDS.PERFECT) return "PERFECT";
  if (score >= TEMPERATURE_THRESHOLDS.BOILING) return "BOILING";
  if (score >= TEMPERATURE_THRESHOLDS.HOT) return "HOT";
  if (score >= TEMPERATURE_THRESHOLDS.WARM) return "WARM";
  if (score >= TEMPERATURE_THRESHOLDS.COOL) return "COOL";
  if (score >= TEMPERATURE_THRESHOLDS.COLD) return "COLD";
  return "FREEZING";
};

/**
 * Get direction (warmer/colder) compared to previous guess
 */
export const getDirection = (currentScore: number, previousScore: number | null): Direction => {
  if (previousScore === null) return "FIRST";
  if (currentScore > previousScore) return "WARMER";
  if (currentScore < previousScore) return "COLDER";
  return "SAME";
};

/**
 * Calculate the score for a guess against the target emoji
 */
export const calculateGuess = (
  guessEmoji: string,
  targetEmoji: string,
  vectors: EmojiVectors,
  previousScore: number | null = null
): GuessResult => {
  const normalizedGuess = normalizeEmoji(guessEmoji);
  const normalizedTarget = normalizeEmoji(targetEmoji);

  const guessVector = vectors[normalizedGuess];
  const targetVector = vectors[normalizedTarget];

  if (!guessVector) {
    throw new Error(`Emoji not found in vectors: ${guessEmoji}`);
  }
  if (!targetVector) {
    throw new Error(`Target emoji not found in vectors: ${targetEmoji}`);
  }

  const similarity = cosineSimilarity(guessVector, targetVector);
  const score = similarityToScore(similarity);
  const temperature = getTemperatureTier(score);
  const direction = getDirection(score, previousScore);
  const isCorrect = normalizedGuess === normalizedTarget;
  const categoryMatch = isSameCategory(guessEmoji, targetEmoji);

  return {
    emoji: guessEmoji,
    score,
    temperature,
    direction,
    isCorrect,
    categoryMatch,
  };
};

/**
 * Create a new game state
 */
export const createGame = (
  targetEmoji: string,
  gameDate: string,
  maxGuesses: number = DEFAULT_MAX_GUESSES
): GameState => {
  return {
    targetEmoji,
    guesses: [],
    isComplete: false,
    isWon: false,
    maxGuesses,
    gameDate,
  };
};

/**
 * Make a guess and update game state
 * Returns the updated game state and the guess result
 */
export const makeGuess = (
  gameState: GameState,
  guessEmoji: string,
  vectors: EmojiVectors
): { gameState: GameState; result: GuessResult } => {
  if (gameState.isComplete) {
    throw new Error("Game is already complete");
  }

  // Get previous score for direction comparison
  const previousScore =
    gameState.guesses.length > 0 ? gameState.guesses[gameState.guesses.length - 1].score : null;

  // Calculate the guess result
  const result = calculateGuess(guessEmoji, gameState.targetEmoji, vectors, previousScore);

  // Create the guess record
  const guess: Guess = {
    emoji: result.emoji,
    score: result.score,
    temperature: result.temperature,
    direction: result.direction,
    categoryMatch: result.categoryMatch,
    timestamp: Date.now(),
  };

  // Update game state
  const newGuesses = [...gameState.guesses, guess];
  const isWon = result.isCorrect;
  const isComplete = isWon || newGuesses.length >= gameState.maxGuesses;

  const newGameState: GameState = {
    ...gameState,
    guesses: newGuesses,
    isComplete,
    isWon,
  };

  return { gameState: newGameState, result };
};

/**
 * Check if an emoji exists in the vectors
 */
export const isValidEmoji = (emoji: string, vectors: EmojiVectors): boolean => {
  const normalized = normalizeEmoji(emoji);
  return normalized in vectors;
};

/**
 * Get all available emojis from the vectors
 */
export const getAvailableEmojis = (vectors: EmojiVectors): string[] => {
  return Object.keys(vectors);
};
