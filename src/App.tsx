import React from "react";
import "./App.css";
import DiceRoller from "./components/DiceRoller";
import "bootstrap/dist/css/bootstrap.min.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <DiceRoller />
    </div>
  );
};

export default App;
