import styles from "./GuessGrid.module.css";

const MAX_GUESSES = 8;

interface GuessGridProps {
  guesses?: string[];
}

const GuessGrid = ({ guesses = [] }: GuessGridProps) => {
  const tiles = Array.from({ length: MAX_GUESSES }, (_, i) => guesses[i] || null);

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
