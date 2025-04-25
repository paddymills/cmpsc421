import "./App.css";
import { Outlet } from "react-router";
import { NavLink } from "react-router";

function App() {
  return (
    <>
      <nav>
        <NavLink to="/tictactoe">Tic Tac Toe</NavLink>
        <NavLink to="/snake">Snake</NavLink>
      </nav>
      <Outlet />
    </>
  );
}

export default App;
