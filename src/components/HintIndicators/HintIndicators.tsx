import styles from "./HintIndicators.module.css";

interface HintIndicatorsProps {
  colorMatch?: boolean | null;
  categoryMatch?: boolean | null;
}

const HintIndicators = ({ colorMatch = null, categoryMatch = null }: HintIndicatorsProps) => {
  const getStatusClass = (match: boolean | null) => {
    if (match === null) return "";
    return match ? styles.correct : styles.incorrect;
  };

  const getStatusText = (match: boolean | null) => {
    if (match === null) return "?";
    return match ? "✓" : "✗";
  };

  return (
    <div className={styles.container}>
      <div className={styles.indicator}>
        <span className={styles.label}>Color</span>
        <div className={`${styles.box} ${getStatusClass(colorMatch)}`}>
          {getStatusText(colorMatch)}
        </div>
      </div>
      <div className={styles.indicator}>
        <span className={styles.label}>Category</span>
        <div className={`${styles.box} ${getStatusClass(categoryMatch)}`}>
          {getStatusText(categoryMatch)}
        </div>
      </div>
    </div>
  );
};

export default HintIndicators;
