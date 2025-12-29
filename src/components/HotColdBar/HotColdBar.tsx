import { useGameStore } from "../../store";
import styles from "./HotColdBar.module.css";

const HotColdBar = () => {
  const gameState = useGameStore((state) => state.gameState);
  const lastGuessResult = useGameStore((state) => state.lastGuessResult);

  const guesses = gameState?.guesses ?? [];
  const latestGuess = guesses[guesses.length - 1];
  const isCorrect = lastGuessResult?.isCorrect ?? false;

  // Calculate position as percentage (0-100)
  // Score of 0 = left edge, score of 100 = right edge (in the box)
  const position = latestGuess?.score ?? 0;

  return (
    <div className={styles.container}>
      <div className={styles.track}>
        <div className={styles.trackLine} />
        {latestGuess && (
          <div
            className={`${styles.indicator} ${isCorrect ? styles.correct : ""}`}
            style={{ left: `${position}%` }}
          >
            {latestGuess.emoji}
          </div>
        )}
      </div>
      <div className={`${styles.mysteryBox} ${isCorrect ? styles.revealed : ""}`}>
        {isCorrect ? latestGuess?.emoji : "?"}
      </div>
    </div>
  );
};

export default HotColdBar;
