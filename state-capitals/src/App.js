import "./App.css";
import { useState } from "react";

function App() {
  const initialStates = [
    { name: "NY", capital: "Albany" },
    { name: "PA", capital: "Harrisburg" },
    { name: "MD", capital: "Annapolis" },
    { name: "VA", capital: "Richmond" },
  ];

  const [states, setStates] = useState(initialStates);
  const addState = (name, capital) => {
    setStates([...states, { name, capital }]);
  };

  return (
    <div className="App">
      <h1>States and their Capitals</h1>
      <span>state list goes here</span>
      <ul>
        {states.map((state) => (
          <li key={state.name}>
            {state.name}: {state.capital}
          </li>
        ))}
      </ul>
      <hr />
      <span>form to add a new state goes here</span>
    </div>
  );
}

export default App;
