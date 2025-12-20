# Semanticon

A daily emoji guessing game

### Overview

This is a daily game, similar to Wordle, where users try to "guess the emoji" in a certain number of tries. For example, if the answer is 🌊 and the user guesses 🦅, the game uses a vector JSON to determine how close the guess is with a percentage point. The user then guesses again and the game will tell them if they are "warmer" or "colder" with each guess, using the vector as the source.

Refer to .md files in the .claude folder at the root of this project for more information:

- PROJECT_STRUCTURE.md
- GAME_ENGINE_AND_TESTING.md
- STATE_MANAGEMENT.md

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

[COMPLETE - See PROJECT_STRUCTURE.md]

2. Build game engine

Build the logic that "runs the game." This consists of the game engine inside ./core and its supporting util functions in .utils. This logic should

- Take in an emoji and, using the vector json in data, check the users emoji guess against the emoji answer to return a score (1-100%) on how close that guess is
- If it's the user's second or later guess, compare the score to the previous guess to determine of the user is getting "warmer" or "colder" to guessing the answer
- Builds a test suite (open to best way to this) that tests this functionality so we can make sure it's working before building the front end
- Note: there are two existing files, utils/vectorCalculator.ts and core/gameEngine.ts, but you may create new files if needed
- Refer to test/game-test.ts for a basic example of how this game can work

[COMPLETE - See GAME_ENGINE_AND_TESTING.md]

3. Use either Zustand or Jotai for state management the app

- Weigh the pros and cons of both and make a suggestions
- Install and set up the package
- Set it up in a way so it can be used both in the game engine and in the front end as well

[COMPLETE - See STATE_MANAGEMENT.md]
