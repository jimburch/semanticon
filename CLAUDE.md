# Semanticon

A daily emoji guessing game

### Overview

This is a daily game, similar to Wordle, where users try to "guess the emoji" in a certain number of tries. For example, if the answer is 🌊 and the user guesses 🦅, the game uses a vector JSON to determine how close the guess is with a percentage point. The user then guesses again and the game will tell them if they are "warmer" or "colder" with each guess, using the vector as the source.

This project will:

- Generate a vector file using the OpenAI script in `gen-vectors.js` (this happens in development only, will never run in production)
- Build back end logic that calculates how close a "guess" is to the correct emoji
- Determine the best tech stack and deployment stack to build and manage the game
- Build a mobile-first front-end UI where users play the game

### Ideal Tech Stack

**Front End**

- Vite JS using React and Typescript
- Bespoke components built with CSS Modules (the UI will be very simple, not need to import an entire UI library)
- Game logic runs locally in TS/JS files, no AI is used in the game itself
- We could explore storing the vector and "emoji of the day" on S3 but this will be local in the MVP iteration
- User game data saves local to user's browser (things like play streak, win streak, etc.), similar to how Wordle does this
- A pre-made, popular emoji keyboard so the user doesn't have to use their own native keyboard when selecting emojis

### Project Steps

1. Organize the Project Structure
   a. Below this comment, draft up a proposed structure of this project that will include
   i. Vite front end
   ii. Emoji vector file
   iii. Game logic that calculates emoji guesses

**Proposed Project Structure:**

```
semanticon/
├── src/
│   ├── core/                      # Pure TypeScript game logic (extraction-ready)
│   │   ├── types.ts               # TypeScript type definitions
│   │   ├── vectorCalculator.ts   # Cosine similarity calculations
│   │   ├── gameEngine.ts          # Game state, rules, guess validation
│   │   └── dailySelector.ts       # Deterministic daily emoji selection
│   │
│   ├── components/                # React components with CSS Modules
│   │   ├── Game/
│   │   │   ├── GameBoard.tsx
│   │   │   ├── GameBoard.module.css
│   │   │   ├── GuessHistory.tsx
│   │   │   └── GuessHistory.module.css
│   │   ├── EmojiPicker/
│   │   │   ├── EmojiPicker.tsx   # Pre-made emoji keyboard integration
│   │   │   └── EmojiPicker.module.css
│   │   ├── Feedback/
│   │   │   ├── SimilarityMeter.tsx
│   │   │   ├── SimilarityMeter.module.css
│   │   │   ├── WarmerColder.tsx
│   │   │   └── WarmerColder.module.css
│   │   ├── Results/
│   │   │   ├── ShareCard.tsx
│   │   │   └── ShareCard.module.css
│   │   └── Stats/
│   │       ├── StatsModal.tsx
│   │       └── StatsModal.module.css
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useGameState.ts
│   │   ├── useLocalStorage.ts    # Persist user data (streaks, history)
│   │   └── useDailyEmoji.ts
│   │
│   ├── data/                      # Static data files
│   │   ├── vectors.json           # Pre-generated emoji embeddings
│   │   └── emojiMetadata.json     # Emoji info (labels, categories)
│   │
│   ├── utils/                     # Helper utilities
│   │   ├── dateUtils.ts           # Date normalization for daily challenges
│   │   └── shareFormatter.ts      # Format game results for sharing
│   │
│   ├── styles/                    # Global styles
│   │   └── global.css
│   │
│   ├── App.tsx
│   ├── App.module.css
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── scripts/                       # Development scripts (not bundled)
│   └── gen-vectors.ts             # Generate vectors via OpenAI API
│
├── public/                        # Static assets
│
├── tests/                         # Unit tests
│   └── core/
│       ├── vectorCalculator.test.ts
│       ├── gameEngine.test.ts
│       └── dailySelector.test.ts
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

**Architecture Principles:**

- **Framework-Agnostic Core**: `src/core/` contains pure TypeScript with no React dependencies, making it easy to extract or move to backend
- **Component Modularity**: Each component gets its own `.module.css` file for scoped styling
- **Type Safety**: TypeScript throughout for better DX and fewer runtime errors
- **Local-First MVP**: All data (vectors, user stats) stored locally; can migrate to S3 later
- **Separation of Concerns**: Game logic → Hooks → Components (one-way data flow)
