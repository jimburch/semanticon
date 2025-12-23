import { useGameStore } from "../../store";
import styles from "./GuessGrid.module.css";

const MAX_GUESSES = 8;

const GuessGrid = () => {
  const gameState = useGameStore((state) => state.gameState);
  const guesses = gameState?.guesses ?? [];

  const tiles = Array.from({ length: MAX_GUESSES }, (_, i) => guesses[i]?.emoji || null);

  return (
    <div className={styles.grid}>
      {tiles.map((emoji, index) => (
        <div key={index} className={styles.tile}>
          {emoji && <span className={styles.emoji}>{emoji}</span>}
        </div>
      ))}
    </div>
  );
};

export default GuessGrid;
