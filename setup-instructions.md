# Solitaire Angular Game Setup Instructions

Follow these steps to set up and run the Solitaire card game in Angular:

## Prerequisites

- Node.js (version 14.x or higher)
- npm (Node Package Manager, version 6.x or higher)
- Angular CLI (version 14.x or higher)

## Step 1: Create a new Angular project

```bash
# Install Angular CLI if you haven't already
npm install -g @angular/cli

# Create a new Angular project
ng new angular-solitaire
cd angular-solitaire
```

## Step 2: Install Angular Material CDK

The game uses Angular's Component Dev Kit (CDK) for drag and drop functionality:

```bash
ng add @angular/cdk
```

## Step 3: Create the game model

Create a file called `solitaire-model.ts` in the `src/app` directory and copy the game model code.

## Step 4: Create the components

Create the following component folders in `src/app/components`:

```
components/
  card/
  pile/
  tableau/
  foundation/
  stock/
  waste/
  game-board/
```

Add the component files to each folder as shown in the code.

## Step 5: Update the app module

Replace the content of `src/app/app.module.ts` with the provided code that imports all necessary components and the CDK drag-drop module.

## Step 6: Update the app component

Replace the content of `src/app/app.component.ts` with the provided code for the root component.

## Step 7: Add the global styles

Copy the provided CSS to `src/styles.css`.

## Step 8: Run the application

```bash
ng serve --open
```

The Solitaire game should now be running on `http://localhost:4200`.

## Game Features

- Classic Klondike Solitaire rules
- Drag and drop card movement
- Auto-move functionality when clicking cards
- Card stacking in tableaus with proper validation
- Foundation building with suits
- Stock draw and waste pile
- Move counter and win detection
- Responsive design for different screen sizes

## Further Enhancements

Here are some ideas to enhance the game:

1. Add animation for card movements
2. Implement a scoring system based on moves and time
3. Add undo/redo functionality
4. Support for different Solitaire variants (Spider, Freecell, etc.)
5. Add a timer and high score tracking
6. Implement auto-complete functionality when all cards are face up
7. Add sound effects and background music options
8. Save and load game state using local storage
9. Add a hint system to suggest possible moves
10. Implement different card themes or deck designs

Enjoy your Angular Solitaire game!
