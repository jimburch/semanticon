/**
 * User stats store with localStorage persistence
 * Tracks games played, win streaks, and guess distribution
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserStats } from "../types";

interface UserStatsStore extends UserStats {
  // Actions
  recordGameResult: (won: boolean, guessCount: number, gameDate: string) => void;
  resetStats: () => void;
}

const DEFAULT_STATS: UserStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: {},
  lastPlayedDate: "",
};

export const useUserStatsStore = create<UserStatsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...DEFAULT_STATS,

      // Record a game result
      recordGameResult: (won, guessCount, gameDate) => {
        const state = get();

        // Check if this is a consecutive day (for streak tracking)
        const isConsecutiveDay = isNextDay(state.lastPlayedDate, gameDate);
        const isSameDay = state.lastPlayedDate === gameDate;

        // Don't record if already played today
        if (isSameDay) {
          return;
        }

        // Update streak
        let newCurrentStreak = state.currentStreak;
        if (won) {
          if (isConsecutiveDay || state.lastPlayedDate === "") {
            newCurrentStreak = state.currentStreak + 1;
          } else {
            newCurrentStreak = 1;
          }
        } else {
          newCurrentStreak = 0;
        }

        // Update guess distribution
        const newGuessDistribution = { ...state.guessDistribution };
        if (won) {
          newGuessDistribution[guessCount] =
            (newGuessDistribution[guessCount] || 0) + 1;
        }

        set({
          gamesPlayed: state.gamesPlayed + 1,
          gamesWon: state.gamesWon + (won ? 1 : 0),
          currentStreak: newCurrentStreak,
          maxStreak: Math.max(state.maxStreak, newCurrentStreak),
          guessDistribution: newGuessDistribution,
          lastPlayedDate: gameDate,
        });
      },

      // Reset all stats
      resetStats: () => {
        set(DEFAULT_STATS);
      },
    }),
    {
      name: "semanticon-user-stats",
    }
  )
);

/**
 * Check if gameDate is the day after lastPlayedDate
 * Expects dates in ISO format (YYYY-MM-DD)
 */
function isNextDay(lastPlayedDate: string, gameDate: string): boolean {
  if (!lastPlayedDate) return false;

  const last = new Date(lastPlayedDate);
  const current = new Date(gameDate);

  // Add one day to last played date
  last.setDate(last.getDate() + 1);

  return (
    last.getFullYear() === current.getFullYear() &&
    last.getMonth() === current.getMonth() &&
    last.getDate() === current.getDate()
  );
}

// Vanilla (non-React) access to the store
export const userStatsStore = useUserStatsStore;
