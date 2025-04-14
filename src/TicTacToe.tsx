import { useState } from "react";
import { Grid } from "@mui/joy";

export function TicTacToeGame() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState(0);

  const turn = (cellIndex: number) => {
    setBoard(board.map((cell, index) => (index === cellIndex ? player : cell)));
    setPlayer(player === 0 ? 1 : 0);
  };

  return (
    <>
      <Grid container columns={3}>
        {board.map((cell, index) => (
          <Grid key={index}>
            <button
              onClick={() =>
                setBoard(board.map((c, i) => (i === index ? turn : c)))
              }
            >
              {cell}
            </button>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
