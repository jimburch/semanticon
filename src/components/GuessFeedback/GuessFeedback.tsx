import { useGameStore } from "../../store";
import styles from "./GuessFeedback.module.css";

const GuessFeedback = () => {
  const lastGuessResult = useGameStore((state) => state.lastGuessResult);

  if (!lastGuessResult) {
    return null;
  }

  const { score, direction, isCorrect } = lastGuessResult;

  // Don't show direction for first guess or correct answer
  const showDirection = direction !== "FIRST" && !isCorrect;

  const getDirectionText = () => {
    switch (direction) {
      case "WARMER":
        return "Warmer!";
      case "COLDER":
        return "Colder";
      case "SAME":
        return "Same";
      default:
        return "";
    }
  };

  const getDirectionClass = () => {
    switch (direction) {
      case "WARMER":
        return styles.warmer;
      case "COLDER":
        return styles.colder;
      default:
        return "";
    }
  };

  if (isCorrect) {
    return (
      <div className={styles.container}>
        <span className={styles.correct}>Correct!</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <span className={styles.score}>{score}% similar</span>
      {showDirection && (
        <span className={`${styles.direction} ${getDirectionClass()}`}>{getDirectionText()}</span>
      )}
    </div>
  );
};

export default GuessFeedback;
