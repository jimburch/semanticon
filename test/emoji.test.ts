import { describe, it, expect } from "vitest";
import { normalizeEmoji, isEmoji } from "../src/utils/emoji";

describe("normalizeEmoji", () => {
  it("removes variation selector (U+FE0F)", () => {
    // The variation selector makes some emojis appear differently
    const emojiWithSelector = "⚾️"; // baseball with FE0F
    const normalized = normalizeEmoji(emojiWithSelector);
    expect(normalized).not.toContain("\uFE0F");
  });

  it("leaves emojis without variation selector unchanged", () => {
    const emoji = "🌮";
    expect(normalizeEmoji(emoji)).toBe("🌮");
  });

  it("handles multiple variation selectors", () => {
    const input = "⚾️⚾️";
    const normalized = normalizeEmoji(input);
    expect(normalized.match(/\uFE0F/g)).toBeNull();
  });
});

describe("isEmoji", () => {
  it("returns true for emoji characters", () => {
    expect(isEmoji("🌮")).toBe(true);
    expect(isEmoji("😀")).toBe(true);
    expect(isEmoji("🎸")).toBe(true);
  });

  it("returns false for regular text", () => {
    expect(isEmoji("hello")).toBe(false);
    expect(isEmoji("abc")).toBe(false);
  });

  it("returns true for string containing emoji", () => {
    expect(isEmoji("hello 🌮")).toBe(true);
  });
});
