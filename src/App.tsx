import { useEffect } from "react";
import styles from "./styles/App.module.css";
import Header from "./components/Header/Header";
import GuessGrid from "./components/GuessGrid/GuessGrid";
import HintIndicators from "./components/HintIndicators/HintIndicators";
import ConfirmGuess from "./components/ConfirmGuess/ConfirmGuess";
import EmojiKeyboard from "./components/EmojiKeyboard/EmojiKeyboard";
import { useGameStore } from "./store";
import emojiVectors from "./data/emoji-vectors.json";

// Hardcoded target emoji for testing
const TEST_TARGET_EMOJI = "⚾";

function App() {
  const { setVectors, initGame, gameState } = useGameStore();

  useEffect(() => {
    // Load vectors and initialize game on mount
    setVectors(emojiVectors);
    initGame(TEST_TARGET_EMOJI, new Date().toISOString().split("T")[0]);
  }, [setVectors, initGame]);

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <GuessGrid />
        <HintIndicators />
        <ConfirmGuess />
        <EmojiKeyboard />
      </main>
      {/* Debug: show game initialized */}
      {gameState && (
        <p style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: "12px" }}>
          Game initialized - Target: {TEST_TARGET_EMOJI}
        </p>
      )}
    </div>
  );
}

export default App;
