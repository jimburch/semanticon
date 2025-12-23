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
- A pre-made, popular emoji keyboard so the user do esn't have to use their own native keyboard when selecting emojis

### Project Steps

1. Organize the Project Structure

[COMPLETE - See PROJECT_STRUCTURE.md]

2. Build game engine

Build the logic that "runs the game." This consists of the game engine inside ./core and its supporting util functions in .utils. This logic should

[COMPLETE - See GAME_ENGINE_AND_TESTING.md]

3. Use either Zustand or Jotai for state management the app

[COMPLETE - See STATE_MANAGEMENT.md]

4. Project Linting

[COMPLETE - LINTER.md]

5. Outline Front End

The goal of this task is to set up the front end in Vite as a basic outline we can iterate. This first iteration should:

- This app is a single page so it should set up the main view
- Create component folders that each have a tsx file and a module.css file
- Have a title ("Semanticon")
- A row of 8 squares or spaces where the emoji guesses will be displayed
- Two spaces below that to show when the user guesses the right color and category of the emoji
- The space for the emoji keyboard where the user will select guesses (don't setup this keyboard yet, just a placeholder)
- Use Wordle for the inspiration of the look and feel, this game should be simple and intuitive
- Don't worry about game functionality yet
