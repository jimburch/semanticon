import { useGameStore } from "../../store";
import styles from "./HintIndicators.module.css";

const HintIndicators = () => {
  const gameState = useGameStore((state) => state.gameState);
  const guesses = gameState?.guesses ?? [];

  // Check if any guess has matched the category
  const hasCategoryMatch = guesses.some((guess) => guess.categoryMatch);

  return (
    <div className={styles.container}>
      <div className={styles.indicator}>
        <span className={styles.label}>Category</span>
        <div className={`${styles.box} ${hasCategoryMatch ? styles.correct : ""}`}>
          {hasCategoryMatch ? "✓" : "?"}
        </div>
      </div>
    </div>
  );
};

export default HintIndicators;
