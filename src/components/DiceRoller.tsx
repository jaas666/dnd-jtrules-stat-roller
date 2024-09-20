import React, { useState } from "react";
import { rollStat, StatRollResult } from "../utils/DiceRoller";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DiceRoller.css"; // Custom CSS for additional styling;

const DiceRoller: React.FC = () => {
  const [stats, setStats] = useState<StatRollResult[]>([]);

  // Roll all stats at once
  const rollAllStats = () => {
    const newStats: StatRollResult[] = [];
    for (let i = 0; i < 6; i++) {
      newStats.push(rollStat());
    }
    setStats(newStats);
  };

  // Roll a specific stat
  const rollSingleStat = (index: number) => {
    const newStat = rollStat();
    const updatedStats = [...stats];
    updatedStats[index] = newStat;
    setStats(updatedStats);
  };

  return (
    <div className="container mt-4 text-white bg-dark">
      <h1 className="text-center">JT Rules D&D Stat Roller</h1>
      <button className="btn btn-primary mb-3" onClick={rollAllStats}>
        Roll All Stats
      </button>

      <div className="row">
        {stats.length > 0 &&
          stats.map((stat, index) => (
            <div key={index} className="col-md-4 mb-3">
              <div className="card bg-secondary text-white">
                <div className="card-body">
                  <h3 className="card-title">Stat {index + 1}</h3>
                  <div className="roll-details">
                    <p>
                      <strong>Initial Rolls:</strong> {stat.rolls.join(", ")}
                    </p>
                    <p>
                      <strong>Rerolls:</strong>
                    </p>
                    <ul className="list-group list-group-flush">
                      {stat.rerolls.map((reroll, i) =>
                        reroll ? (
                          <li
                            key={i}
                            className="list-group-item bg-dark text-white"
                          >
                            Dice {i + 1} was rerolled {reroll.length} time
                            {reroll.length !== 1 ? "s" : ""}
                          </li>
                        ) : (
                          <li
                            key={i}
                            className="list-group-item bg-dark text-white"
                          >
                            Dice {i + 1}: No rerolls
                          </li>
                        )
                      )}
                    </ul>
                    <p>
                      <strong>Final Total:</strong> {stat.finalTotal}
                    </p>
                    <button
                      className="btn btn-light"
                      onClick={() => rollSingleStat(index)}
                    >
                      Reroll Stat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DiceRoller;
