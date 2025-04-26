import { useState, useEffect } from "react";
import { Button, Modal, ModalDialog, ModalClose, Typography } from "@mui/joy";
import "./TicTacToe.css";
import { Cell } from "./Cell";

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
  Human = "O",
  Computer = "X",
}

function nextPlayer(player: Player) {
  return player === Player.Human ? Player.Computer : Player.Human;
}

export function TicTacToeGame() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState(Player.Human);
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
        setModalText(
          rowPlayer === Player.Human ? "You won!" : "Computer wins.",
        );

        // stop game
        setPlaying(false);
        return;
      }
    }

    // check stalemate
    if (board.filter((c) => !c).length === 0) {
      setModalText("No one wins.");
      setPlaying(false);
    }
  }, [board]);
  useEffect(() => {
    if (player === Player.Computer) {
      computerTurn();
    }
  }, [player]);

  const restart = () => {
    setBoard(Array(9).fill(null));
    setPlayer(Player.Human);
    setPlaying(true);
  };

  const markBoard = (cellIndex: number) => {
    console.log(`Player ${player} chose cell ${cellIndex}`);

    // validate, justincase
    if (board[cellIndex] !== null)
      throw new Error(`Cell(${cellIndex}) already marked`);

    setBoard(board.map((cell, index) => (index === cellIndex ? player : cell)));
    setPlayer(nextPlayer(player));
  };

  const humanTurn = (cellIndex: number) => {
    if (!playing || board[cellIndex] || player === Player.Computer) return;

    markBoard(cellIndex);
  };

  const computerTurn = () => {
    let choices: number[];

    // player is hardcoded to go first, so board will not be empty
    // if this is the computer's first turn, pick a corner or the center
    if (board.every((cell) => cell !== Player.Computer)) {
      choices = [0, 2, 4, 6, 8].filter((cell) => board[cell] === null);
      return markBoard(choices[Math.floor(Math.random() * choices.length)]);
    }

    // look for a line to complete for a win
    choices = wins
      // find lines that have 1 empty cell and 2 computer cells
      .filter(
        (line) =>
          line.map((l) => board[l]).join("") === Player.Computer.repeat(2),
      )
      // find empty cell
      .map((line) => line.filter((i) => board[i] === null)[0]);
    if (choices.length > 0) {
      return markBoard(choices[0]);
    }

    // look for a move to pick that could lead to a win (already has 1 mark for player)
    choices = wins
      // find lines that have 2 empty cells and 1 computer cells
      .filter((line) => line.map((l) => board[l]).join("") === Player.Computer)
      // find empty cell
      .map((line) => line.filter((i) => board[i] === null))
      .flat();
    if (choices.length > 0) {
      // choose a random cell that could lead to a win
      return markBoard(choices[Math.floor(Math.random() * choices.length)]);
    }

    // pick random open cell
    choices = board.filter((cell) => cell === null);
    return markBoard(choices[Math.floor(Math.random() * choices.length)]);
  };

  return (
    <>
      <div className="game">
        <p>Player {player === Player.Human ? 1 : 2} turn</p>
        <div className="board ttt">
          {board.map((cell, index) => (
            <Cell key={index} index={index} onClick={() => humanTurn(index)}>
              {cell}
            </Cell>
          ))}
        </div>
        <Button onClick={restart}>Restart</Button>
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
