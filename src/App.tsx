import styles from './styles/App.module.css'
import { Header, GuessGrid, HintIndicators, EmojiKeyboard } from './components'

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
  )
}

export default App
