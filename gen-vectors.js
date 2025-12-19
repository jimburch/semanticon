import fs from "fs";
import { createRequire } from "module";
import OpenAI from "openai";

// 1. SETUP & CONFIG
const require = createRequire(import.meta.url);

// FORCE LOAD .env
// We do this immediately to ensure the key is available
const dotenv = require("dotenv");
dotenv.config();

// DEBUG: Un-comment this if it still fails to see what is being loaded
// console.log("Current Key:", process.env.OPENAI_API_KEY);

const emojiData = require("emoji-datasource");

const openai = new OpenAI({
  // If the env var is missing, this will now print undefined instead of crashing immediately
  apiKey: process.env.OPENAI_API_KEY,
});

// 2. Filter & Prepare Data
console.log(`Original count: ${emojiData.length}`);

const cleanEmojis = emojiData.filter((e) => {
  return e.has_img_apple && !e.name.includes("SKIN TONE");
});

console.log(`Filtered count: ${cleanEmojis.length} (Ready to embed)`);

// 3. The Embedding Loop
async function generateVectors() {
  const output = {};
  const BATCH_SIZE = 100;

  for (let i = 0; i < cleanEmojis.length; i += BATCH_SIZE) {
    const batch = cleanEmojis.slice(i, i + BATCH_SIZE);

    // Create the "Meaning String"
    const inputs = batch.map((e) => {
      const keywordString = (e.keywords || []).join(" ");

      // FIX A: Use short_name so "Heavy Black Heart" becomes just "Heart"
      // This stops the AI from confusing it with "Heavy Dollar Sign"
      const humanName = e.short_name.replace(/-/g, " ");

      return `Concept: ${humanName}. Keywords: ${keywordString}`;
    });

    try {
      console.log(`Processing batch ${i} to ${i + BATCH_SIZE}...`);

      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: inputs,
        dimensions: 100, // FIX B: Increased to 100 for better accuracy
      });

      // Map results back to emoji characters
      response.data.forEach((item, index) => {
        // FIX C: Strip invisible variation selectors (\uFE0F)
        // This ensures the key matches exactly what users type (⚾ vs ⚾️)
        const codePoints = batch[index].unified.split("-").map((u) => "0x" + u);
        const emojiChar = String.fromCodePoint(...codePoints).replace(
          /\uFE0F/g,
          ""
        );

        output[emojiChar] = item.embedding;
      });
    } catch (error) {
      console.error("Error on batch:", error);
    }
  }

  // 4. Save to JSON
  fs.writeFileSync("emoji-vectors.json", JSON.stringify(output));
  console.log("✅ Done! Saved to emoji-vectors.json");
}

generateVectors();
