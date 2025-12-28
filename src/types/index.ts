/**
 * Type definitions for Semanticon game engine
 */

// Vector Types
export type EmojiVector = number[];
export type EmojiVectors = Record<string, EmojiVector>;

// Temperature feedback tiers (absolute score-based)
export type TemperatureTier = "FREEZING" | "COLD" | "COOL" | "WARM" | "HOT" | "BOILING" | "PERFECT";

// Direction feedback (relative to previous guess)
export type Direction = "WARMER" | "COLDER" | "SAME" | "FIRST";

// Result of a single guess
export interface GuessResult {
  emoji: string;
  score: number; // 0-100 percentage
  temperature: TemperatureTier;
  direction: Direction;
  isCorrect: boolean;
  categoryMatch: boolean; // true if guess is in same category as target
}

// A recorded guess in game history
export interface Guess {
  emoji: string;
  score: number;
  temperature: TemperatureTier;
  direction: Direction;
  categoryMatch: boolean;
  timestamp: number;
}

// Current game state
export interface GameState {
  targetEmoji: string;
  guesses: Guess[];
  isComplete: boolean;
  isWon: boolean;
  maxGuesses: number;
  gameDate: string; // ISO date string for daily game
}

// User statistics for localStorage
export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<number, number>; // guess count -> number of wins
  lastPlayedDate: string;
}

// Temperature tier thresholds
export interface TemperatureThresholds {
  FREEZING: number;
  COLD: number;
  COOL: number;
  WARM: number;
  HOT: number;
  BOILING: number;
}
