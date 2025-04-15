import { useState } from "react";
import { Button, Modal, ModalDialog, ModalClose, Typography } from "@mui/joy";

type Loc = {
  row: number;
  col: number;
};

type Turn = {
  loc: Loc;
  dir: string;
};

type Snake = {
  length: number;
  head: Loc;
  tail: Loc;
  turns: Turn[];
  update: () => Snake;
};

export function SnakeGame() {
  const [board, setBoard] = useState(Array(20 * 10).fill(null));
  // const [direction, setDirection] = useState("right");
  const [modalText, setModalText] = useState<string | null>(null);

  const restart = () => {
    setBoard(Array(20 * 10).fill(null));
    setModalText(null);
  };

  return (
    <>
      <div className="game">
        <Button onClick={restart}>Restart</Button>
        <div className="board snake">
          {board.map((cell, index) => (
            <div key={index} className="snake-cell">
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
