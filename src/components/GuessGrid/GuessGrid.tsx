import { useGameStore } from "../../store";
import type { Guess } from "../../types";
import styles from "./GuessGrid.module.css";

const MAX_GUESSES = 8;

type TileData = {
  emoji: string | null;
  guess: Guess | null;
  isPending: boolean;
};

const getTileClass = (tile: TileData, isLastGuessInLostGame: boolean): string => {
  if (tile.isPending) {
    return styles.tile;
  }

  if (!tile.guess) {
    return styles.tile;
  }

  // Correct guess - green
  if (tile.guess.score === 100) {
    return `${styles.tile} ${styles.correct}`;
  }

  // Last guess in a lost game - red
  if (isLastGuessInLostGame) {
    return `${styles.tile} ${styles.incorrect}`;
  }

  // Same category - yellow
  if (tile.guess.categoryMatch) {
    return `${styles.tile} ${styles.sameCategory}`;
  }

  // Wrong category - grey
  return `${styles.tile} ${styles.wrongCategory}`;
};

const GuessGrid = () => {
  const gameState = useGameStore((state) => state.gameState);
  const selectedEmoji = useGameStore((state) => state.selectedEmoji);
  const guesses = gameState?.guesses ?? [];
  const isLost = (gameState?.isComplete ?? false) && !(gameState?.isWon ?? false);

  // Build tile data array
  const tiles: TileData[] = Array.from({ length: MAX_GUESSES }, (_, i) => {
    const guess = guesses[i] ?? null;

    // If this is the next empty slot and there's a selected emoji, show it as pending
    if (!guess && i === guesses.length && selectedEmoji) {
      return { emoji: selectedEmoji, guess: null, isPending: true };
    }

    return { emoji: guess?.emoji ?? null, guess, isPending: false };
  });

  return (
    <div className={styles.grid}>
      {tiles.map((tile, index) => (
        <div key={index} className={getTileClass(tile, isLost && index === guesses.length - 1)}>
          {tile.emoji && <span className={styles.emoji}>{tile.emoji}</span>}
        </div>
      ))}
    </div>
  );
};

export default GuessGrid;
