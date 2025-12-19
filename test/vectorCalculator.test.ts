import { describe, it, expect } from "vitest";
import {
  cosineSimilarity,
  similarityToScore,
} from "../src/core/vectorCalculator";

describe("cosineSimilarity", () => {
  it("returns 1 for identical vectors", () => {
    const vec = [1, 2, 3, 4];
    expect(cosineSimilarity(vec, vec)).toBeCloseTo(1, 5);
  });

  it("returns 0 for orthogonal vectors", () => {
    const vecA = [1, 0, 0, 0];
    const vecB = [0, 1, 0, 0];
    expect(cosineSimilarity(vecA, vecB)).toBe(0);
  });

  it("returns -1 for opposite vectors", () => {
    const vecA = [1, 2, 3];
    const vecB = [-1, -2, -3];
    expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(-1, 5);
  });

  it("returns 0 when either vector is zero", () => {
    const vecA = [0, 0, 0];
    const vecB = [1, 2, 3];
    expect(cosineSimilarity(vecA, vecB)).toBe(0);
    expect(cosineSimilarity(vecB, vecA)).toBe(0);
  });

  it("calculates similarity for similar vectors", () => {
    const vecA = [1, 0, 0];
    const vecB = [0.9, 0.1, 0];
    const similarity = cosineSimilarity(vecA, vecB);
    expect(similarity).toBeGreaterThan(0.9);
    expect(similarity).toBeLessThan(1);
  });
});

describe("similarityToScore", () => {
  it("converts 1 to 100", () => {
    expect(similarityToScore(1)).toBe(100);
  });

  it("converts 0.5 to 50", () => {
    expect(similarityToScore(0.5)).toBe(50);
  });

  it("converts 0 to 0", () => {
    expect(similarityToScore(0)).toBe(0);
  });

  it("clamps negative values to 0", () => {
    expect(similarityToScore(-0.5)).toBe(0);
  });

  it("rounds to nearest integer", () => {
    expect(similarityToScore(0.756)).toBe(76);
    expect(similarityToScore(0.754)).toBe(75);
  });
});
