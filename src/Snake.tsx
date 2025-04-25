import { useState, useEffect, useCallback } from "react";
import { Button, Modal, ModalDialog, ModalClose, Typography } from "@mui/joy";

// movements per second
const SPEED = 4;

type Loc = {
  row: number;
  col: number;
};

type Snake = Loc[];

enum Direction {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
}

const REVERSE_MAP = {
  [Direction.UP]: Direction.DOWN,
  [Direction.DOWN]: Direction.UP,
  [Direction.LEFT]: Direction.RIGHT,
  [Direction.RIGHT]: Direction.LEFT,
};

function initSnake(): Snake {
  return [
    { row: 3, col: 5 },
    { row: 3, col: 4 },
    { row: 3, col: 3 },
  ];
}

export function SnakeGame() {
  const [direction, setDirection] = useState(Direction.RIGHT);
  const [modalText, setModalText] = useState<string | null>(null);
  const [snake, setSnake] = useState<Snake>(initSnake());
  const [playing, setPlaying] = useState(true);
  const [food, setFood] = useState<Loc>({ row: 5, col: 10 });

  const board = () => {
    const board = Array(10 * 20).fill("snake-cell");
    snake.forEach((loc) => {
      board[loc.row * 20 + loc.col] = "snake-body";
    });
    board[food.row * 20 + food.col] = "snake-food";

    return board;
  };

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // make sure not modifier keys are down
      if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey)
        return;

      const turn = (newDirection: Direction) => {
        // - check that turn is not 180 or the same direction
        // - update turn
        const [dirA, dirB] = [direction, newDirection].sort();
        if (dirA === dirB || REVERSE_MAP[dirA] === dirB) return;

        setDirection(newDirection);
      };

      // movement is arrow keys, WASD and HJKL(vim)
      switch (event.key) {
        case "ArrowUp":
        case "w":
        case "k":
          turn(Direction.UP);
          break;
        case "ArrowDown":
        case "s":
        case "j":
          turn(Direction.DOWN);
          break;
        case "ArrowLeft":
        case "a":
        case "h":
          turn(Direction.LEFT);
          break;
        case "ArrowRight":
        case "d":
        case "l":
          turn(Direction.RIGHT);
          break;
        default:
          console.log(`Unexpected key: ${event.key}`);
      }
    },
    [direction],
  );

  const restart = () => {
    setSnake(initSnake());
    setDirection(Direction.RIGHT);
    setPlaying(true);
    setModalText(null);
  };

  const move = useCallback(() => {
    // - add head in direction
    // - remove tail if not(justAte)
    // - set justAte = false

    if (!playing) return;

    const newSnake = snake.slice();

    // copy head
    newSnake.unshift(JSON.parse(JSON.stringify(newSnake[0])));

    switch (direction) {
      case Direction.UP:
        newSnake[0].row -= 1;
        break;
      case Direction.DOWN:
        newSnake[0].row += 1;
        break;
      case Direction.LEFT:
        newSnake[0].col -= 1;
        break;
      case Direction.RIGHT:
        newSnake[0].col += 1;
        break;
    }

    // handle growth/movement
    if (newSnake[0].row === food.row && newSnake[0].col === food.col) {
      let newFood: Loc;
      do {
        newFood = {
          row: Math.floor(Math.random() * 10),
          col: Math.floor(Math.random() * 20),
        };
      } while (
        newSnake.some(
          (segment) =>
            segment.row === newFood.row && segment.col === newFood.col,
        )
      );

      setFood(newFood);
    } else {
      newSnake.pop();
    }

    // head occurences (for testing a crash into snake)
    const head = newSnake[0];
    const collision = newSnake
      .slice(1)
      .some((cell) => cell.row === head.row && cell.col === head.col);

    // check for game over
    if (collision) {
      setPlaying(false);
      setModalText("Game Over. You ran into yourself.");
      return;
    } else if (
      newSnake[0].row < 0 ||
      newSnake[0].row >= 10 ||
      newSnake[0].col < 0 ||
      newSnake[0].col >= 20
    ) {
      setPlaying(false);
      setModalText("Game Over. You hit a wall.");
      return;
    }

    setSnake(newSnake);
  }, [direction, snake, playing, food]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const intervalId = setInterval(move, 1000 / SPEED);
    return () => clearInterval(intervalId);
  }, [move]);

  return (
    <>
      <div className="game">
        <Button onClick={restart}>Restart</Button>
        <h4>Score: {snake.length - 3}</h4>
        <div className="board snake">
          {board().map((cell, index) => (
            <div key={index} className={cell}></div>
          ))}
        </div>
        <div>
          <p>Try not to run into the wall or yourself</p>
          <p>Red blocks are food</p>
          <p>Movement is</p>
          <ul>
            <li>Arrow Keys</li>
            <li>WASD</li>
            <li>HJKL (vim)</li>
          </ul>
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
