import { useGameStore } from "../../store";
import { getHotColdBarState } from "../../utils/hotColdBar";
import styles from "./HotColdBar.module.css";

const HotColdBar = () => {
  const gameState = useGameStore((state) => state.gameState);
  const lastGuessResult = useGameStore((state) => state.lastGuessResult);

  const { currentEmoji, position, isCorrect, hasGuesses } = getHotColdBarState(
    gameState,
    lastGuessResult
  );

  return (
    <div className={styles.container}>
      <div className={styles.track}>
        <div className={styles.trackLine} />
        {hasGuesses && (
          <div
            className={`${styles.indicator} ${isCorrect ? styles.correct : ""}`}
            style={{ left: `${position}%` }}
          >
            {currentEmoji}
          </div>
        )}
      </div>
      <div className={`${styles.mysteryBox} ${isCorrect ? styles.revealed : ""}`}>
        {isCorrect ? currentEmoji : "?"}
      </div>
    </div>
  );
};

export default HotColdBar;
