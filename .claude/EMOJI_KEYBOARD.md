# Emoji Keyboard Implementation

## Overview

The emoji keyboard is built using [emoji-picker-react](https://www.npmjs.com/package/emoji-picker-react), a popular React emoji picker with built-in category filtering, dark theme support, and search functionality.

## Package Choice

| Package Evaluated      | Decision                                                   |
| ---------------------- | ---------------------------------------------------------- |
| **emoji-picker-react** | Selected - Built-in category filtering, dark theme support |
| Frimousse              | Lightweight but no category filtering support              |
| emoji-mart             | Feature-rich but uses external CDN for sprites             |

### Why emoji-picker-react?

- **Category filtering**: Native support for excluding categories (symbols, flags)
- **Dark theme**: Built-in theme prop with CSS variable overrides
- **Search**: Built-in search functionality
- **Popular**: Most popular React emoji picker with active maintenance
- **Customizable**: Extensive props for configuration

## Category Filtering

The keyboard excludes symbols and flags categories to focus on emojis relevant to the game:

```tsx
const ALLOWED_CATEGORIES = [
  { category: Categories.SMILEYS_PEOPLE, name: "Smileys & People" },
  { category: Categories.ANIMALS_NATURE, name: "Animals & Nature" },
  { category: Categories.FOOD_DRINK, name: "Food & Drink" },
  { category: Categories.TRAVEL_PLACES, name: "Travel & Places" },
  { category: Categories.ACTIVITIES, name: "Activities" },
  { category: Categories.OBJECTS, name: "Objects" },
];
```

## User Experience

### Selection Flow

1. **Browse/Search**: User browses categories or searches for an emoji
2. **Select**: Tap an emoji to select it
3. **Validate**: System checks if emoji exists in vector file
4. **Confirm**: User taps "Guess" button to lock in their choice
5. **Cancel**: User can cancel and pick a different emoji

### Error Handling

If a user selects an emoji that isn't in the vector file (~1,908 valid emojis), they see a friendly error message: _"This emoji isn't in today's game"_

## File Structure

```
src/components/EmojiKeyboard/
├── EmojiKeyboard.tsx       # Main component with emoji-picker-react
├── EmojiKeyboard.module.css # Dark theme style overrides
└── index.ts                 # Barrel export
```

## Styling

The picker uses its built-in dark theme with CSS variable overrides to match the app's design:

```css
.container :global(.EmojiPickerReact) {
  --epr-bg-color: transparent;
  --epr-category-label-bg-color: var(--color-bg);
  --epr-search-input-bg-color: var(--color-surface);
  --epr-picker-border-color: transparent;
  --epr-search-border-color: var(--color-border);
  --epr-highlight-color: var(--color-surface);
}
```

### Theme Variables Used

| Element           | Variable          | Value   |
| ----------------- | ----------------- | ------- |
| Root background   | transparent       | -       |
| Search background | `--color-surface` | #1a1a1b |
| Search border     | `--color-border`  | #3a3a3c |
| Category labels   | `--color-bg`      | #121213 |
| Hover state       | `--color-surface` | #1a1a1b |

## Dependencies

```json
{
  "emoji-picker-react": "^4.x"
}
```

## Component Props Used

| Prop                | Value                    | Description                   |
| ------------------- | ------------------------ | ----------------------------- |
| `onEmojiClick`      | callback                 | Called when emoji is selected |
| `theme`             | `Theme.DARK`             | Dark theme mode               |
| `categories`        | `ALLOWED_CATEGORIES`     | Filtered category list        |
| `width`             | `"100%"`                 | Full width of container       |
| `height`            | `400`                    | Fixed height in pixels        |
| `searchPlaceHolder` | `"Search emojis..."`     | Placeholder text              |
| `previewConfig`     | `{ showPreview: false }` | Disable emoji preview         |

## Known Limitations

1. **Bundle Size**: emoji-picker-react is larger than alternatives (~2.5MB) but provides essential filtering features

2. **CDN Dependency**: Emoji data may be fetched from CDN. For offline support, additional configuration would be required.

## Future Improvements

1. **Recently used**: Track and display recently selected emojis
2. **Skin tone persistence**: Remember user's preferred skin tone
3. **Haptic feedback**: Add vibration on mobile when selecting emojis

## Usage Example

```tsx
import EmojiKeyboard from "./components/EmojiKeyboard";

function Game() {
  return <EmojiKeyboard />;
}
```

## Sources

- [emoji-picker-react GitHub](https://github.com/ealush/emoji-picker-react)
- [emoji-picker-react npm](https://www.npmjs.com/package/emoji-picker-react)
