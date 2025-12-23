import { useState } from 'react'
import { EmojiPicker } from 'frimousse'
import { useGameStore } from '../../store'
import styles from './EmojiKeyboard.module.css'

interface EmojiKeyboardProps {
  onGuess?: (emoji: string) => void
  disabled?: boolean
}

export function EmojiKeyboard({ onGuess, disabled = false }: EmojiKeyboardProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const isValidGuess = useGameStore((state) => state.isValidGuess)

  const handleEmojiSelect = (emoji: { emoji: string; label: string }) => {
    setError(null)

    if (!isValidGuess(emoji.emoji)) {
      setError("This emoji isn't in today's game")
      setSelectedEmoji(null)
      return
    }

    setSelectedEmoji(emoji.emoji)
  }

  const handleConfirm = () => {
    if (selectedEmoji && onGuess) {
      onGuess(selectedEmoji)
      setSelectedEmoji(null)
    }
  }

  const handleCancel = () => {
    setSelectedEmoji(null)
    setError(null)
  }

  return (
    <div className={styles.container}>
      {/* Preview area */}
      <div className={styles.previewArea}>
        {selectedEmoji ? (
          <div className={styles.preview}>
            <span className={styles.previewEmoji}>{selectedEmoji}</span>
            <div className={styles.previewActions}>
              <button className={styles.cancelButton} onClick={handleCancel} type="button">
                Cancel
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleConfirm}
                disabled={disabled}
                type="button"
              >
                Guess
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.previewPlaceholder}>
            {error ? (
              <span className={styles.error}>{error}</span>
            ) : (
              <span>Select an emoji to guess</span>
            )}
          </div>
        )}
      </div>

      {/* Emoji picker */}
      <div className={styles.pickerWrapper}>
        <EmojiPicker.Root onEmojiSelect={handleEmojiSelect} className={styles.picker} columns={8}>
          <EmojiPicker.Search className={styles.search} placeholder="Search emojis..." />
          <EmojiPicker.Viewport className={styles.viewport}>
            <EmojiPicker.Loading className={styles.loading}>Loading emojis...</EmojiPicker.Loading>
            <EmojiPicker.Empty className={styles.empty}>No emojis found</EmojiPicker.Empty>
            <EmojiPicker.List className={styles.list} />
          </EmojiPicker.Viewport>
        </EmojiPicker.Root>
      </div>
    </div>
  )
}
