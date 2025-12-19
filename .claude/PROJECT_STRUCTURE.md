**Current Project Structure:**

```
semanticon/
├── src/
│   ├── core/                      # Pure TypeScript game logic (extraction-ready)
│   │   ├── vectorCalculator.ts   # Cosine similarity calculations
│   │   └── gameEngine.ts          # Game state, rules, guess validation
│   │
│   ├── components/                # React components (to be built)
│   │
│   ├── hooks/                     # Custom React hooks (to be built)
│   │
│   ├── data/                      # Static data files
│   │   └── emoji-vectors.json     # Pre-generated emoji embeddings
│   │
│   ├── utils/                     # Helper utilities (to be built)
│   │
│   ├── types/                     # TypeScript type definitions (to be built)
│   │
│   ├── styles/                    # Styles
│   │   ├── global.css
│   │   └── App.module.css
│   │
│   ├── assets/                    # Static assets
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── test/                          # Unit tests
│
├── public/                        # Static public assets
│
├── gen-vectors.js                 # Generate vectors via OpenAI API (dev only)
├── .env                           # Environment variables (not committed)
├── .gitignore
├── .prettierrc
├── .prettierignore
├── eslint.config.js
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

**Architecture Principles:**

- **Framework-Agnostic Core**: `src/core/` contains pure TypeScript with no React dependencies, making it easy to extract or move to backend
- **Component Modularity**: Each component gets its own `.module.css` file for scoped styling
- **Type Safety**: TypeScript throughout for better DX and fewer runtime errors
- **Local-First MVP**: All data (vectors, user stats) stored locally; can migrate to S3 later
- **Separation of Concerns**: Game logic → Hooks → Components (one-way data flow)
