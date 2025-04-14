import { useState } from "react";
import "./App.css";
import { Button, ToggleButtonGroup } from "@mui/joy";
import { TicTacToeGame } from "./TicTacToe";
import { SnakeGame } from "./Snake";

function App() {
  const [game, setGame] = useState<string>("TicTacToe");

  let gameBoard;
  if (game === "TicTacToe") {
    gameBoard = <TicTacToeGame />;
  } else if (game === "Snake") {
    gameBoard = <SnakeGame />;
  }

  return (
    <>
      <ToggleButtonGroup
        value={game}
        onChange={(_event, newValue) => setGame(newValue || game)}
      >
        <Button value="TicTacToe">TicTacToe</Button>
        <Button value="Snake">Snake</Button>
      </ToggleButtonGroup>
      {gameBoard}
    </>
  );
}

export default App;
