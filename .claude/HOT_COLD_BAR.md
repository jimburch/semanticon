# Hot/Cold Progress Bar

## Overview

Replaced the text-based "warmer/colder" feedback with a visual progress bar that shows how close the user's guess is to the target emoji.

## Implementation

### New Component: `HotColdBar`

**Location:** `src/components/HotColdBar/HotColdBar.tsx`

The component displays:

- A horizontal track with a movable emoji indicator
- A mystery box at the right end showing `?` until solved

### Visual States

**Empty (no guesses):**

```
|------------------------------| [?]
```

**After a guess (e.g., 30% similar):**

```
|--------[emoji]---------------| [?]
```

**Correct answer:**

```
|------------------------------| [emoji]
```

### Features

1. **Smooth Animation**: CSS transitions (0.4s ease-out) animate the emoji sliding left/right as guesses get warmer or colder

2. **Position Calculation**: Emoji position maps directly to similarity score (0% = left edge, 100% = right edge)

3. **Correct Answer State**: When the user guesses correctly:
   - The indicator emoji fades out as it reaches the box
   - The mystery box reveals the correct emoji with a green border

### Files Changed

| File                                              | Change                                     |
| ------------------------------------------------- | ------------------------------------------ |
| `src/components/HotColdBar/HotColdBar.tsx`        | New component                              |
| `src/components/HotColdBar/HotColdBar.module.css` | New styles with animation                  |
| `src/App.tsx`                                     | Replaced `GuessFeedback` with `HotColdBar` |

### CSS Variables Used

- `--color-border` - Track line color
- `--color-border-light` - Mystery box border
- `--color-surface` - Mystery box background
- `--color-correct` - Revealed box color (green)
- `--color-text-muted` - Question mark color

## Notes

- The percentage text was removed per requirements (bar position alone indicates closeness)
- The bar is always visible, even before the first guess
- The old `GuessFeedback` component remains in the codebase but is no longer used
