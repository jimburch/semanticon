# Emoji Keyboard Implementation

## Overview

The emoji keyboard is built using [Frimousse](https://frimousse.liveblocks.io), a lightweight (~8KB), unstyled, and composable emoji picker for React. It provides excellent UX with search, keyboard navigation, and category organization.

## Package Choice

| Package Evaluated  | Decision                                       |
| ------------------ | ---------------------------------------------- |
| **Frimousse**      | Selected - Lightweight, composable, great UX   |
| emoji-picker-react | Heavier (~2.5MB), pre-styled                   |
| emoji-mart         | Feature-rich but uses external CDN for sprites |

### Why Frimousse?

- **Lightweight**: ~8KB bundle size vs 1.5-2.5MB alternatives
- **Unstyled**: Full control over dark theme styling
- **Composable**: Easy to customize and extend
- **Virtualized**: Smooth scrolling with large emoji sets
- **Search**: Built-in search functionality
- **Keyboard navigation**: Full accessibility support

## User Experience

### Selection Flow

1. **Browse/Search**: User browses categories or searches for an emoji
2. **Select**: Tap an emoji to preview it
3. **Validate**: System checks if emoji exists in vector file
4. **Confirm**: User taps "Guess" button to lock in their choice
5. **Cancel**: User can cancel and pick a different emoji

### Error Handling

If a user selects an emoji that isn't in the vector file (~1,908 valid emojis), they see a friendly error message: _"This emoji isn't in today's game"_

## Component API

```tsx
interface EmojiKeyboardProps {
  onGuess?: (emoji: string) => void // Called when user confirms a guess
  disabled?: boolean // Disable the confirm button
}
```

## File Structure

```
src/components/EmojiKeyboard/
├── EmojiKeyboard.tsx       # Main component with Frimousse integration
├── EmojiKeyboard.module.css # Dark theme styles
└── index.ts                 # Barrel export
```

## Styling

The picker is styled to match the app's dark theme using CSS variables:

- Background: `--color-surface` (#1a1a1b)
- Borders: `--color-border` (#3a3a3c)
- Text: `--color-text` (#ffffff)
- Muted text: `--color-text-muted` (#818384)
- Confirm button: `--color-correct` (#538d4e)

Frimousse's internal elements are styled via global `[data-frimousse-*]` attribute selectors.

## Dependencies

```json
{
  "frimousse": "^0.3.0"
}
```

## Known Limitations

1. **Full Emoji Set Displayed**: Frimousse loads emoji data from emojibase CDN and doesn't support filtering to a custom subset. Validation happens on selection.

2. **CDN Dependency**: Emoji metadata is fetched from `cdn.jsdelivr.net/npm/emojibase-data`. For offline support, self-hosting would be required.

## Future Improvements

1. **Self-hosted emoji data**: Host a filtered emojibase dataset containing only the ~1,908 valid emojis
2. **Recently used**: Track and display recently selected emojis
3. **Skin tone persistence**: Remember user's preferred skin tone
4. **Haptic feedback**: Add vibration on mobile when selecting emojis

## Usage Example

```tsx
import { EmojiKeyboard } from './components'

function Game() {
  const handleGuess = (emoji: string) => {
    console.log('User guessed:', emoji)
    // Process the guess...
  }

  return <EmojiKeyboard onGuess={handleGuess} disabled={gameOver} />
}
```

## Sources

- [Frimousse Documentation](https://frimousse.liveblocks.io)
- [Frimousse GitHub](https://github.com/liveblocks/frimousse)
- [emoji-picker-react](https://www.npmjs.com/package/emoji-picker-react)
- [emoji-mart](https://github.com/missive/emoji-mart)
