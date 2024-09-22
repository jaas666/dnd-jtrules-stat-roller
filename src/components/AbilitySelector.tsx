import React from "react";
import { StatRollResult } from "../utils/DiceRoller";

interface AbilitySelectorProps {
  stats: StatRollResult[];
  assignedStats: Record<string, number | null>;
  setAssignedStats: React.Dispatch<
    React.SetStateAction<Record<string, number | null>>
  >;
}

const abilities = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

const AbilitySelector: React.FC<AbilitySelectorProps> = ({
  stats,
  assignedStats,
  setAssignedStats,
}) => {
  const handleStatChange = (
    ability: string,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const updatedStats = { ...assignedStats };
    const selectedValue =
      event.target.value === "" ? null : parseInt(event.target.value, 10);
    updatedStats[ability] = selectedValue;
    setAssignedStats(updatedStats);
  };

  // Get a list of already selected stats to disable them in other selects
  const selectedStats = Object.values(assignedStats).filter(
    (stat) => stat !== null
  );

  return (
    <div className="row">
      {abilities.map((ability, index) => (
        <div key={index} className="col-md-4 mb-3">
          <label htmlFor={ability} className="form-label text-white">
            {ability.charAt(0).toUpperCase() + ability.slice(1)}
          </label>
          <select
            id={ability}
            className="form-select"
            value={assignedStats[ability] ?? ""}
            onChange={(event) => handleStatChange(ability, event)}
          >
            <option value="">-- Select Stat --</option>
            {stats.map((stat, idx) => (
              <option
                key={idx}
                value={stat.finalTotal}
                disabled={selectedStats.includes(stat.finalTotal)}
              >
                {stat.finalTotal} (Roll: {stat.rolls.join(", ")})
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default AbilitySelector;
