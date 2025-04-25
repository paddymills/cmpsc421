import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { TicTacToeGame } from "./TicTacToe.tsx";
import { SnakeGame } from "./Snake.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="tictactoe" element={<TicTacToeGame />} />
          <Route path="snake" element={<SnakeGame />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
