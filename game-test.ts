import fs from 'fs';
import path from 'path';

type Vector = number[];
type VectorMap = Record<string, Vector>;

const vectorsPath = path.join(__dirname, 'emoji-vectors.json');
const vectors: VectorMap = JSON.parse(fs.readFileSync(vectorsPath, 'utf-8'));

console.log(`Loaded ${Object.keys(vectors).length} emojis.`);

function cleanEmoji(str: string): string {
  return str.replace(/\uFE0F/g, '');
}

function cosineSimilarity(vecA: Vector, vecB: Vector): number {
  const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

function playRound(guessEmoji: string, targetEmoji: string): void {
  const cleanGuess = cleanEmoji(guessEmoji);
  const cleanTarget = cleanEmoji(targetEmoji);

  if (!vectors[cleanGuess] || !vectors[cleanTarget]) {
    console.log(`❌ Error: Emoji not found (Guess: ${cleanGuess}, Target: ${cleanTarget})`);
    return;
  }

  const score = cosineSimilarity(vectors[cleanGuess], vectors[cleanTarget]);
  const percent = Math.max(0, Math.round(score * 100));

  let feedback = "🧊 FREEZING";
  if (percent > 20) feedback = "☁️ COOL";
  if (percent > 40) feedback = "☀️ WARM";
  if (percent > 60) feedback = "🔥 HOT";
  if (percent > 80) feedback = "🌋 BOILING";
  if (percent === 100) feedback = "🎉 PERFECT";

  console.log(`Guess: ${guessEmoji} -> Target: ${targetEmoji} | Score: ${percent}% | ${feedback}`);
}

function findClosest(targetEmoji: string, topN: number = 5): void {
  const cleanTarget = cleanEmoji(targetEmoji);

  if (!vectors[cleanTarget]) {
    console.log(`Emoji ${targetEmoji} not found.`);
    return;
  }

  console.log(`\n🔎 Searching for matches to: ${targetEmoji}`);

  const targetVec = vectors[cleanTarget];
  const results: { emoji: string; score: number }[] = [];

  for (const [emoji, vec] of Object.entries(vectors)) {
    if (emoji === cleanTarget) continue;
    const score = cosineSimilarity(targetVec, vec);
    results.push({ emoji, score });
  }

  results.sort((a, b) => b.score - a.score);

  results.slice(0, topN).forEach((r, i) => {
    console.log(`#${i + 1}: ${r.emoji} (${(r.score * 100).toFixed(1)}%)`);
  });
}

console.log("\n--- GAMEPLAY TESTS ---");
const target = "🌮";
playRound("⚾️", target);
playRound("🍎", target);
playRound("🍕", target);

console.log("\n--- SEMANTIC INTELLIGENCE CHECK ---");
findClosest("💀");
findClosest("🍔");
findClosest("❤️");