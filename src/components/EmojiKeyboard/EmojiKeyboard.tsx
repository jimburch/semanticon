import styles from './EmojiKeyboard.module.css'

export function EmojiKeyboard() {
  return (
    <div className={styles.container}>
      <div className={styles.placeholder}>
        <span className={styles.icon}>⌨️</span>
        <span className={styles.text}>Emoji keyboard coming soon</span>
      </div>
    </div>
  )
}
