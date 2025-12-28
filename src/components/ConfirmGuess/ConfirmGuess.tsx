import { useState } from "react";
import { useGameStore } from "../../store";
import styles from "./ConfirmGuess.module.css";

const ConfirmGuess = () => {
  const { selectedEmoji, confirmGuess, gameState } = useGameStore();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    setError(null);
    const result = confirmGuess();

    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  const isDisabled = !selectedEmoji || gameState?.isComplete;

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={handleConfirm} disabled={isDisabled}>
        {selectedEmoji ? (
          <span>Confirm</span>
        ) : (
          <span className={styles.placeholder}>Select an emoji to guess</span>
        )}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default ConfirmGuess;
