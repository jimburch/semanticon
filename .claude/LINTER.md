# Linting & Code Quality Setup

## Overview

This project uses ESLint 9 (flat config) for linting and Prettier for formatting, with Husky git hooks to enforce quality standards before commits and pushes.

## Tools Configured

| Tool        | Purpose                                         |
| ----------- | ----------------------------------------------- |
| ESLint 9    | TypeScript/React linting with recommended rules |
| Prettier    | Code formatting                                 |
| Husky       | Git hooks management                            |
| lint-staged | Run linters on staged files only                |

## ESLint Configuration

**File:** `eslint.config.js`

Uses the new ESLint 9 flat config format with these presets:

- `@eslint/js` - Base JavaScript rules (recommended)
- `typescript-eslint` - TypeScript-specific rules (recommended)
- `eslint-plugin-react-hooks` - React hooks rules
- `eslint-plugin-react-refresh` - Vite HMR compatibility
- `eslint-config-prettier` - Disables formatting rules that conflict with Prettier

The rule level is **relaxed** - only recommended presets are enabled to catch real errors without being overly strict.

## Prettier Configuration

**File:** `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

## Git Hooks

### Pre-commit (via lint-staged)

Runs automatically on staged files when you commit:

- `*.{ts,tsx}` files: ESLint fix + Prettier format
- `*.{json,css,md}` files: Prettier format only

### Pre-push

Runs the full quality gate before allowing push:

1. `npm run test:run` - Run all tests
2. `npm run lint` - Check for lint errors
3. `npm run typecheck` - TypeScript type checking

If any of these fail, the push is blocked.

## NPM Scripts

| Script              | Command              | Description                 |
| ------------------- | -------------------- | --------------------------- |
| `npm run lint`      | `eslint .`           | Check for lint errors       |
| `npm run lint:fix`  | `eslint . --fix`     | Auto-fix lint errors        |
| `npm run format`    | `prettier --write .` | Format all files            |
| `npm run typecheck` | `tsc --noEmit`       | Type-check without emitting |

## Packages Added

- `eslint-config-prettier` - Prettier compatibility for ESLint
- `husky` - Git hooks management
- `lint-staged` - Run commands on staged files

## Usage

### Day-to-day Development

Just write code and commit normally. lint-staged will auto-fix and format your staged files.

### Before Pushing

The pre-push hook automatically runs tests, lint, and type-check. If anything fails, fix the issues before pushing.

### Manual Commands

```bash
# Check for lint errors
npm run lint

# Auto-fix lint errors
npm run lint:fix

# Format all files
npm run format

# Type-check
npm run typecheck
```
