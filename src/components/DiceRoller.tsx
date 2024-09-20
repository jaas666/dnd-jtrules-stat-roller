import React, { useState } from "react";
import { rollStat, StatRollResult } from "../utils/DiceRoller";
import "./DiceRoller.css";

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
    <div className="dice-roller-container">
      <h1>JT Rules D&D Stat Roller</h1>
      <button className="roll-button" onClick={rollAllStats}>
        Roll All Stats
      </button>

      <div className="stats-list">
        {stats.length > 0 &&
          stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3>Stat {index + 1}</h3>
              <div className="roll-details">
                <p>
                  <strong>Initial Rolls:</strong> {stat.rolls.join(", ")}
                </p>
                <p>
                  <strong>Rerolls:</strong>
                </p>
                <ul className="reroll-list">
                  {stat.rerolls.map((reroll, i) =>
                    reroll ? (
                      <li key={i}>
                        Dice {i + 1} rerolled: {reroll.join(", ")}
                      </li>
                    ) : (
                      <li key={i}>Dice {i + 1}: No rerolls</li>
                    )
                  )}
                </ul>
                <p>
                  <strong>Final Total:</strong> {stat.finalTotal}
                </p>
                <button
                  className="roll-button-small"
                  onClick={() => rollSingleStat(index)}
                >
                  Reroll Stat
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DiceRoller;
