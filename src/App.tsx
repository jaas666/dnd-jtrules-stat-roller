import React from "react";
import "./App.css";
import DiceRoller from "./components/DiceRoller";
import "bootstrap/dist/css/bootstrap.min.css";
import { Analytics } from "@vercel/analytics/react";

const App: React.FC = () => {
  return (
    <div className="App">
      <DiceRoller />
      <Analytics />
    </div>
  );
};

export default App;
