/**
 * Emoji category utilities using emojibase data
 * Used to determine if two emojis are in the same category
 */

import { normalizeEmoji } from "./emoji";

interface EmojibaseEntry {
  emoji: string;
  hexcode: string;
  group: number;
  subgroup: number;
  label: string;
}

// Group ID to readable name mapping (from emojibase)
const GROUP_NAMES: Record<number, string> = {
  0: "smileys-emotion",
  1: "people-body",
  2: "component",
  3: "animals-nature",
  4: "food-drink",
  5: "travel-places",
  6: "activities",
  7: "objects",
  8: "symbols",
  9: "flags",
};

// Cache for emoji data
let emojiDataCache: EmojibaseEntry[] | null = null;
let emojiGroupMap: Map<string, number> | null = null;

/**
 * Fetch and cache emojibase data
 */
export const loadEmojiData = async (): Promise<void> => {
  if (emojiDataCache) return;

  try {
    const response = await fetch("https://cdn.jsdelivr.net/npm/emojibase-data@latest/en/data.json");
    emojiDataCache = await response.json();

    // Build lookup map for quick access
    // Store both normalized and original versions for flexible matching
    emojiGroupMap = new Map();
    for (const entry of emojiDataCache!) {
      // Store with original key
      emojiGroupMap.set(entry.emoji, entry.group);
      // Also store with normalized key (without variation selectors)
      const normalized = normalizeEmoji(entry.emoji);
      if (normalized !== entry.emoji) {
        emojiGroupMap.set(normalized, entry.group);
      }
    }
  } catch (error) {
    console.error("Failed to load emoji data:", error);
  }
};

/**
 * Get the group ID for an emoji
 */
export const getEmojiGroup = (emoji: string): number | null => {
  if (!emojiGroupMap) return null;

  // Try original first
  const group = emojiGroupMap.get(emoji);
  if (group !== undefined) return group;

  // Try normalized version
  const normalized = normalizeEmoji(emoji);
  return emojiGroupMap.get(normalized) ?? null;
};

/**
 * Get the readable group name for an emoji
 */
export const getEmojiGroupName = (emoji: string): string | null => {
  const groupId = getEmojiGroup(emoji);
  if (groupId === null) return null;
  return GROUP_NAMES[groupId] ?? null;
};

/**
 * Check if two emojis are in the same category/group
 */
export const isSameCategory = (emoji1: string, emoji2: string): boolean => {
  const group1 = getEmojiGroup(emoji1);
  const group2 = getEmojiGroup(emoji2);

  if (group1 === null || group2 === null) {
    return false;
  }

  return group1 === group2;
};

/**
 * Check if emoji data is loaded
 */
export const isEmojiDataLoaded = (): boolean => {
  return emojiGroupMap !== null;
};
