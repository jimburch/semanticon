import fs from "fs";
import { createRequire } from "module";
import OpenAI from "openai";
const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config();

const emojiData = require("emoji-datasource");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log(`Original count: ${emojiData.length}`);

const cleanEmojis = emojiData.filter((e) => {
  return e.has_img_apple && !e.name.includes("SKIN TONE");
});

console.log(`Filtered count: ${cleanEmojis.length} (Ready to embed)`);

async function generateVectors() {
  const output = {};
  const BATCH_SIZE = 100;

  for (let i = 0; i < cleanEmojis.length; i += BATCH_SIZE) {
    const batch = cleanEmojis.slice(i, i + BATCH_SIZE);

    const inputs = batch.map((e) => {
      const keywordString = (e.keywords || []).join(" ");

      const humanName = e.short_name.replace(/-/g, " ");

      return `Concept: ${humanName}. Keywords: ${keywordString}`;
    });

    try {
      console.log(`Processing batch ${i} to ${i + BATCH_SIZE}...`);

      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: inputs,
        dimensions: 100,
      });

      response.data.forEach((item, index) => {
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

  fs.writeFileSync("emoji-vectors.json", JSON.stringify(output));
  console.log("✅ Done! Saved to emoji-vectors.json");
}

generateVectors();
