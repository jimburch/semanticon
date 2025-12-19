const fs = require('fs');
const OpenAI = require('openai');
const emojiData = require('emoji-datasource');
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DIMENSIONS = 100;
const BATCH_SIZE = 100;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

function cleanEmojiKey(unified) {
  const codePoints = unified.split('-').map(u => parseInt(u, 16));
  const char = String.fromCodePoint(...codePoints);
  return char.replace(/\uFE0F/g, '');
}

const cleanEmojis = emojiData.filter(e => {
  return e.has_img_apple && !e.name.includes("SKIN TONE");
});

console.log(`Filtered count: ${cleanEmojis.length}`);

async function generateVectors() {
  const output = {};

  for (let i = 0; i < cleanEmojis.length; i += BATCH_SIZE) {
    const batch = cleanEmojis.slice(i, i + BATCH_SIZE);

    const inputs = batch.map(e => {
      const keywordString = (e.keywords || []).join(" ");
      const humanName = e.short_name.replace(/-/g, ' ');
      return `Concept: ${humanName}. Keywords: ${keywordString}`;
    });

    try {
      console.log(`Processing batch ${i} to ${i + BATCH_SIZE}...`);

      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: inputs,
        dimensions: DIMENSIONS
      });

      response.data.forEach((item, index) => {
        const originalEntry = batch[index];
        const cleanKey = cleanEmojiKey(originalEntry.unified);
        output[cleanKey] = item.embedding;
      });

    } catch (error) {
      console.error(`Error on batch starting at index ${i}:`, error);
    }
  }

  fs.writeFileSync('emoji-vectors.json', JSON.stringify(output));
  console.log(`Done! Saved ${Object.keys(output).length} vectors.`);
}

generateVectors();