/**
 * Generates a filtered emojibase data file for frimousse
 * Excludes: symbols (group 8) and flags (group 9)
 *
 * Run with: node gen-filtered-emojis.js
 */

import fs from "fs";

const EMOJIBASE_URL =
  "https://cdn.jsdelivr.net/npm/emojibase-data@latest/en/compact.json";

// Groups to exclude
const EXCLUDED_GROUPS = [
  8, // symbols
  9, // flags
];

async function generateFilteredEmojis() {
  console.log("Fetching emojibase data...");

  const response = await fetch(EMOJIBASE_URL);
  const emojis = await response.json();

  console.log(`Original count: ${emojis.length}`);

  const filtered = emojis.filter(
    (emoji) => !EXCLUDED_GROUPS.includes(emoji.group)
  );

  console.log(`Filtered count: ${filtered.length}`);
  console.log(
    `Removed: ${emojis.length - filtered.length} emojis (symbols + flags)`
  );

  fs.mkdirSync("public/emojis/en", { recursive: true });
  fs.writeFileSync("public/emojis/en/compact.json", JSON.stringify(filtered));
  console.log("✅ Done! Saved to public/emojis/en/compact.json");
}

generateFilteredEmojis();
