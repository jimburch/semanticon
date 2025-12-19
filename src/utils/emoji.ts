/**
 * Utility functions for emoji handling
 */

/**
 * Normalize an emoji by removing variation selectors (U+FE0F)
 * This ensures consistent matching against the vectors data
 */
export const normalizeEmoji = (emoji: string): string => {
  return emoji.replace(/\uFE0F/g, "");
};

/**
 * Check if a string is a valid emoji (basic check)
 */
export const isEmoji = (str: string): boolean => {
  const emojiRegex = /\p{Emoji}/u;
  return emojiRegex.test(str);
};
