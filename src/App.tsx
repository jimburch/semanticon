import styles from "./styles/App.module.css";
import Header from "./components/Header/Header";
import GuessGrid from "./components/GuessGrid/GuessGrid";
import HintIndicators from "./components/HintIndicators/HintIndicators";
import EmojiKeyboard from "./components/EmojiKeyboard/EmojiKeyboard";

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <GuessGrid />
        <HintIndicators />
        <EmojiKeyboard />
      </main>
    </div>
  );
}

export default App;
