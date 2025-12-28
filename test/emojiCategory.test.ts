import { describe, it, expect, beforeAll, vi } from "vitest";
import {
  loadEmojiData,
  getEmojiGroup,
  getEmojiGroupName,
  isSameCategory,
  isEmojiDataLoaded,
} from "../src/utils/emojiCategory";

// Mock emojibase data for testing
const mockEmojibaseData = [
  { emoji: "😀", hexcode: "1F600", group: 0, subgroup: 0, label: "grinning face" },
  { emoji: "😃", hexcode: "1F603", group: 0, subgroup: 0, label: "grinning face with big eyes" },
  { emoji: "🐶", hexcode: "1F436", group: 3, subgroup: 30, label: "dog face" },
  { emoji: "🐱", hexcode: "1F431", group: 3, subgroup: 30, label: "cat face" },
  { emoji: "⚾", hexcode: "26BE", group: 6, subgroup: 63, label: "baseball" },
  { emoji: "🎱", hexcode: "1F3B1", group: 6, subgroup: 63, label: "pool 8 ball" },
  { emoji: "🏀", hexcode: "1F3C0", group: 6, subgroup: 63, label: "basketball" },
  { emoji: "🍕", hexcode: "1F355", group: 4, subgroup: 48, label: "pizza" },
  { emoji: "🍔", hexcode: "1F354", group: 4, subgroup: 48, label: "hamburger" },
  // Include one with variation selector for testing normalization
  { emoji: "⚾️", hexcode: "26BE-FE0F", group: 6, subgroup: 63, label: "baseball" },
];

describe("emojiCategory", () => {
  beforeAll(async () => {
    // Mock fetch to return our test data
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockEmojibaseData),
    });

    await loadEmojiData();
  });

  describe("loadEmojiData", () => {
    it("loads emoji data successfully", () => {
      expect(isEmojiDataLoaded()).toBe(true);
    });

    it("does not reload if already loaded", async () => {
      const fetchCallCount = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.length;
      await loadEmojiData();
      expect((global.fetch as ReturnType<typeof vi.fn>).mock.calls.length).toBe(fetchCallCount);
    });
  });

  describe("getEmojiGroup", () => {
    it("returns correct group for smileys", () => {
      expect(getEmojiGroup("😀")).toBe(0);
      expect(getEmojiGroup("😃")).toBe(0);
    });

    it("returns correct group for animals", () => {
      expect(getEmojiGroup("🐶")).toBe(3);
      expect(getEmojiGroup("🐱")).toBe(3);
    });

    it("returns correct group for activities", () => {
      expect(getEmojiGroup("⚾")).toBe(6);
      expect(getEmojiGroup("🎱")).toBe(6);
    });

    it("returns correct group for food", () => {
      expect(getEmojiGroup("🍕")).toBe(4);
      expect(getEmojiGroup("🍔")).toBe(4);
    });

    it("returns null for unknown emoji", () => {
      expect(getEmojiGroup("🦄")).toBeNull();
    });

    it("handles emojis with variation selectors", () => {
      // The normalized version should work
      expect(getEmojiGroup("⚾️")).toBe(6);
      expect(getEmojiGroup("⚾")).toBe(6);
    });
  });

  describe("getEmojiGroupName", () => {
    it("returns correct group name for smileys", () => {
      expect(getEmojiGroupName("😀")).toBe("smileys-emotion");
    });

    it("returns correct group name for animals", () => {
      expect(getEmojiGroupName("🐶")).toBe("animals-nature");
    });

    it("returns correct group name for activities", () => {
      expect(getEmojiGroupName("⚾")).toBe("activities");
    });

    it("returns correct group name for food", () => {
      expect(getEmojiGroupName("🍕")).toBe("food-drink");
    });

    it("returns null for unknown emoji", () => {
      expect(getEmojiGroupName("🦄")).toBeNull();
    });
  });

  describe("isSameCategory", () => {
    it("returns true for emojis in the same category", () => {
      // Both smileys
      expect(isSameCategory("😀", "😃")).toBe(true);
      // Both animals
      expect(isSameCategory("🐶", "🐱")).toBe(true);
      // Both activities (sports)
      expect(isSameCategory("⚾", "🎱")).toBe(true);
      expect(isSameCategory("⚾", "🏀")).toBe(true);
      // Both food
      expect(isSameCategory("🍕", "🍔")).toBe(true);
    });

    it("returns false for emojis in different categories", () => {
      // Smiley vs animal
      expect(isSameCategory("😀", "🐶")).toBe(false);
      // Activity vs food
      expect(isSameCategory("⚾", "🍕")).toBe(false);
      // Animal vs food
      expect(isSameCategory("🐶", "🍔")).toBe(false);
    });

    it("returns false if either emoji is unknown", () => {
      expect(isSameCategory("🦄", "😀")).toBe(false);
      expect(isSameCategory("😀", "🦄")).toBe(false);
      expect(isSameCategory("🦄", "🦸")).toBe(false);
    });

    it("returns true for same emoji", () => {
      expect(isSameCategory("😀", "😀")).toBe(true);
      expect(isSameCategory("⚾", "⚾")).toBe(true);
    });

    it("handles variation selector differences", () => {
      // Baseball with and without variation selector
      expect(isSameCategory("⚾️", "⚾")).toBe(true);
      expect(isSameCategory("⚾", "🎱")).toBe(true);
    });
  });
});
