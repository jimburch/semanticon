# Front End Outline

## Overview

The front end is built with React + TypeScript + Vite, using CSS Modules for styling. The design is inspired by Wordle with a dark theme and mobile-first responsive layout.

## Design Decisions

| Aspect              | Choice                                        |
| ------------------- | --------------------------------------------- |
| Color Scheme        | Dark mode (#121213 background)                |
| Guess Grid          | 8 tiles - single row (desktop), 2x4 (mobile)  |
| Hint Indicators     | Two labeled boxes for "Color" and "Category"  |
| Component Structure | Flat folder structure under `src/components/` |

## Component Architecture

```
src/
├── components/
│   ├── Header/
│   │   ├── Header.tsx
│   │   ├── Header.module.css
│   │   └── index.ts
│   ├── GuessGrid/
│   │   ├── GuessGrid.tsx
│   │   ├── GuessGrid.module.css
│   │   └── index.ts
│   ├── HintIndicators/
│   │   ├── HintIndicators.tsx
│   │   ├── HintIndicators.module.css
│   │   └── index.ts
│   ├── EmojiKeyboard/
│   │   ├── EmojiKeyboard.tsx
│   │   ├── EmojiKeyboard.module.css
│   │   └── index.ts
│   └── index.ts          # Barrel export
├── styles/
│   ├── global.css        # CSS reset + CSS variables
│   └── App.module.css    # App layout styles
├── App.tsx
└── main.tsx
```

## Components

### Header

- Displays the game title "SEMANTICON"
- Centered with bottom border separator

### GuessGrid

- 8 tiles for emoji guesses
- **Desktop**: Single row of 8 tiles (58px each)
- **Mobile** (< 580px): Two rows of 4 tiles (48px each)
- Props: `guesses?: string[]` - Array of guessed emojis

### HintIndicators

- Two labeled boxes: "Color" and "Category"
- Shows match status: `?` (pending), `✓` (correct), `✗` (incorrect)
- Props: `colorMatch?: boolean | null`, `categoryMatch?: boolean | null`

### EmojiKeyboard

- Placeholder component for future emoji picker
- Shows dashed border with "Emoji keyboard coming soon" message

## CSS Variables

Defined in `global.css`:

```css
/* Colors */
--color-bg: #121213;
--color-surface: #1a1a1b;
--color-border: #3a3a3c;
--color-text: #ffffff;
--color-text-muted: #818384;
--color-correct: #538d4e; /* Green for correct */
--color-present: #b59f3b; /* Yellow for present */
--color-absent: #3a3a3c; /* Gray for absent */

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;

/* Typography */
--font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
--font-size-sm: 12px;
--font-size-md: 14px;
--font-size-lg: 16px;
--font-size-xl: 24px;
--font-size-title: 36px;

/* Sizing */
--tile-size: 58px;
--tile-size-mobile: 48px;
--border-radius: 4px;
```

## Next Steps

1. **Integrate emoji keyboard** - Add a pre-made emoji picker library
2. **Wire up game state** - Connect components to Zustand stores
3. **Add animations** - Tile flip animations on guess, shake on wrong
4. **Add game stats modal** - Show streak, win percentage, etc.
