import { EmojiPicker } from "frimousse";
import styles from "./EmojiKeyboard.module.css";

const EmojiKeyboard = () => {
  return (
    <EmojiPicker.Root className={styles.emojiKeyboard}>
      <EmojiPicker.Search />
      <EmojiPicker.Viewport className={styles.emojiPickerViewport}>
        <EmojiPicker.Loading className={styles.emojiPickerLoading}>Loading…</EmojiPicker.Loading>
        <EmojiPicker.Empty className={styles.emojiPickerEmpty}>No emoji found.</EmojiPicker.Empty>
        <EmojiPicker.List className={styles.emojiPickerList} />
      </EmojiPicker.Viewport>
    </EmojiPicker.Root>
  );
};

export default EmojiKeyboard;
