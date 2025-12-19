/**
 * Vector similarity calculations for emoji comparison
 */

import type { EmojiVector } from "../types";

/**
 * Calculate cosine similarity between two vectors
 * Returns a value between -1 and 1, where 1 means identical vectors
 */
export const cosineSimilarity = (
  vecA: EmojiVector,
  vecB: EmojiVector
): number => {
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
};

/**
 * Convert cosine similarity to a 0-100 percentage score
 */
export const similarityToScore = (similarity: number): number => {
  return Math.max(0, Math.round(similarity * 100));
};
