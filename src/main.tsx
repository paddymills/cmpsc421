import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { TicTacToeGame } from "./tictactoe/TicTacToe.tsx";
import { SnakeGame } from "./snek/Snake.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<p>Pick a game</p>} />
          <Route path="tictactoe" element={<TicTacToeGame />} />
          <Route path="snake" element={<SnakeGame />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
