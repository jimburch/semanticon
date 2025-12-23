import { EmojiPicker } from "frimousse";
import { useGameStore } from "../../store";
import "./EmojiKeyboard.module.css";

const EmojiKeyboard = () => {
  const selectEmoji = useGameStore((state) => state.selectEmoji);

  const handleEmojiSelect = ({ emoji }: { emoji: string }) => {
    selectEmoji(emoji);
  };

  return (
    <EmojiPicker.Root onEmojiSelect={handleEmojiSelect}>
      <EmojiPicker.Search />
      <EmojiPicker.Viewport>
        <EmojiPicker.Loading>Loading…</EmojiPicker.Loading>
        <EmojiPicker.Empty>No emoji found.</EmojiPicker.Empty>
        <EmojiPicker.List />
      </EmojiPicker.Viewport>
    </EmojiPicker.Root>
  );
};

export default EmojiKeyboard;
