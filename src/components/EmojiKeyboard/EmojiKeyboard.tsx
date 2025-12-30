import EmojiPicker, { Theme, Categories } from "emoji-picker-react";
import { useGameStore } from "../../store";
import styles from "./EmojiKeyboard.module.css";

// Categories to display (excludes symbols and flags)
const ALLOWED_CATEGORIES = [
  { category: Categories.SMILEYS_PEOPLE, name: "Smileys & People" },
  { category: Categories.ANIMALS_NATURE, name: "Animals & Nature" },
  { category: Categories.FOOD_DRINK, name: "Food & Drink" },
  { category: Categories.TRAVEL_PLACES, name: "Travel & Places" },
  { category: Categories.ACTIVITIES, name: "Activities" },
  { category: Categories.OBJECTS, name: "Objects" },
];

const EmojiKeyboard = () => {
  const selectEmoji = useGameStore((state) => state.selectEmoji);

  return (
    <div className={styles.container}>
      <EmojiPicker
        onEmojiClick={(emojiData) => selectEmoji(emojiData.emoji)}
        theme={Theme.DARK}
        categories={ALLOWED_CATEGORIES}
        width="100%"
        height={400}
        searchPlaceHolder="Search emojis..."
        previewConfig={{ showPreview: false }}
      />
    </div>
  );
};

export default EmojiKeyboard;
