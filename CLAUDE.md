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

[COMPLETE - FRONT_END_OUTLINE.md]

6. Emoji Keyboard

[COMPLETE - EMOJI_KEYBOARD.md]

6A. Style Emoji Keyboard

[COMPLETE - See EMOJI_KEYBOARD.md]

7A. Confirm Guess

7B: Initialize Game

7C: Improved Game UI

[COMPLETE - See GUESSING.md]

8: Hot/Cold Progress Bar

I want to build a progess bar that shows how hot or cold a guess is to the final answer. I'll try to visualize it using text below.

A fresh progress bar with no guesses would look like this:

|------------------------------| [?]

The bar is empty with a box to the right that is filled with a question mark to show the mystery emoji of the day. When the user makes their first guess, that guessed emoji slides in from the right and stops relative to the percentage of how close the guess is:

|--------😄--------------------| [?]

When the user guesses again, the emoji will slide left or right, depending on if the guess is warmer or colder and then change to the newest guessed emoji:

|--------------------🏈--------| [?]

The emoji will continue to slide left and right and change depending on the user's guesses. When the user guesses the correct answer, the emoji will slide all the way into the box on the right and change into the correctly guessed emoji:

|------------------------------| [⚾]

This will not affect how the guess boxes behave. Instead this will replace the warmer/colder text that is currently below the guess boxes. Don't worry too much about overstyling the bar right now. Let's keep it basic and iterate.

Ask clarifying questions, implement, then give a summary of your work in HOT_COLD_BAR.md.
