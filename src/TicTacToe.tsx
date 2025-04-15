import { useState, useEffect } from "react";
import { Button, Modal, ModalDialog, ModalClose, Typography } from "@mui/joy";

const wins: number[][] = [
  // rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  // columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  // diagonal
  [0, 4, 8],
  [2, 4, 6],
];

enum Player {
  One = "O",
  Two = "X",
}

function nextPlayer(player: Player) {
  return player === Player.One ? Player.Two : Player.One;
}

export function TicTacToeGame() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState(Player.One);
  const [playing, setPlaying] = useState(true);
  const [modalText, setModalText] = useState<string | null>(null);

  useEffect(() => {
    // check win
    for (const win of wins) {
      const rowPlayer = win
        .map((x) => board[x])
        .reduce((acc, val) => (acc && acc === val ? acc : null));
      // if all row values in row are equal and not null
      if (rowPlayer) {
        console.log(`Player ${rowPlayer} wins!`);
        setModalText(`Player ${rowPlayer} wins!`);

        // stop game
        setPlaying(false);
        return;
      }
    }

    // check stalemate
    if (board.filter((c) => !c).length === 0) {
      setModalText("No one wins!");
      setPlaying(false);
    }
  }, [board]);

  const restart = () => {
    setBoard(Array(9).fill(null));
    setPlayer(Player.One);
    setPlaying(true);
  };

  const turn = (cellIndex: number) => {
    if (!playing || board[cellIndex]) return;

    setBoard(board.map((cell, index) => (index === cellIndex ? player : cell)));
    setPlayer(nextPlayer(player));
  };

  return (
    <>
      <div className="game">
        <Button onClick={restart}>Restart</Button>
        <div className="board ttt">
          {board.map((cell, index) => (
            <div key={index} className="ttt-cell" onClick={() => turn(index)}>
              {cell}
            </div>
          ))}
        </div>
      </div>
      <Modal open={modalText !== null} onClose={() => setModalText(null)}>
        <ModalDialog>
          <ModalClose />
          <Typography>{modalText}</Typography>
        </ModalDialog>
      </Modal>
    </>
  );
}
