# Agent Guidelines for Semanticon Project

## Build/Lint/Test Commands

### Build Commands

- `npm run build` - Build the application for production
- `npm run dev` - Start development server
- `npm run preview` - Preview built application locally

### Linting and Formatting

- `npm run lint` - Run ESLint on all files
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

### Testing

- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once and exit
- `npm test -- --run --reporter=verbose` - Run tests with verbose output
- `npm test path/to/file.test.ts` - Run a specific test file

## Code Style Guidelines

### Imports and Module Organization

- Use TypeScript imports with explicit file extensions for better tooling support
- Group imports by type: external libraries, internal modules, local files
- Prefer named imports over default imports when possible
- Organize imports alphabetically within each group
- Use relative paths for local imports (e.g., `../components/Button`)

### Formatting and Structure

- Use Prettier with the following settings:
  - semicolons: true
  - singleQuote: false
  - tabWidth: 2
  - trailingComma: "es5"
  - printWidth: 100
- Format code automatically before committing using `npm run format`
- Follow existing code structure in the repository for consistent styling

### TypeScript and Naming Conventions

- Use camelCase for variable and function names
- Use PascalCase for component names
- Use uppercase for constants (e.g., `const MAX_RETRY_ATTEMPTS = 5`)
- Use descriptive naming with clear intent (avoid abbreviations like "ctx" unless widely understood)
- Follow TypeScript best practices for type definitions and interfaces

### Error Handling

- Use try/catch blocks for async operations
- Handle errors gracefully in UI components
- Log significant errors to console but avoid exposing sensitive information
- Use error boundaries for React components where appropriate

### Components and State Management

- Use functional components with hooks
- Implement Zod validation where appropriate (as seen in the project)
- Store global state using Zustand store pattern
- Create reusable, componentized solutions that follow existing patterns

## Testing Approach

- Write tests using Vitest and React Testing Library
- Test both positive and negative cases
- Mock dependencies appropriately when necessary
- Keep tests focused on a single behavior or function
- Ensure all tests pass before merging changes
