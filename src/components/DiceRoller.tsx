import React, { useState } from "react";
import { rollStat, StatRollResult } from "../utils/DiceRoller";
import RaceSelector from "./RaceSelector";
import SubRaceSelector from "./SubRaceSelector";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DiceRoller.css"; // Custom CSS for additional styling

const ABILITIES = [
  "Strength",
  "Dexterity",
  "Constitution",
  "Intelligence",
  "Wisdom",
  "Charisma",
];

const DiceRoller: React.FC = () => {
  const [stats, setStats] = useState<StatRollResult[]>([]);
  const [assignedStats, setAssignedStats] = useState<(string | null)[]>(
    Array(6).fill(null)
  );
  const [race, setRace] = useState<any>(null);
  const [subRace, setSubRace] = useState<any>(null);

  // Roll all stats at once
  const rollAllStats = () => {
    const newStats: StatRollResult[] = [];
    for (let i = 0; i < 6; i++) {
      newStats.push(rollStat());
    }
    setStats(newStats);
    setAssignedStats(Array(6).fill(null)); // Reset assigned stats
  };

  // Roll a specific stat
  const rollSingleStat = (index: number) => {
    const newStat = rollStat();
    const updatedStats = [...stats];
    updatedStats[index] = newStat;
    setStats(updatedStats);
  };

  // Calculate available abilities based on current assignments
  const getAvailableAbilities = (currentIndex: number) => {
    return ABILITIES.filter(
      (ability) =>
        !assignedStats.includes(ability) ||
        assignedStats[currentIndex] === ability
    );
  };

  // Handle ability selection for each stat
  const handleAbilitySelect = (index: number, selectedAbility: string) => {
    const updatedAssignedStats = [...assignedStats];
    updatedAssignedStats[index] = selectedAbility;
    setAssignedStats(updatedAssignedStats);

    // Recalculate totals with bonuses
    const updatedStatsWithBonuses = stats.map((stat, i) => ({
      ...stat,
      finalTotalWithBonus: calculateBonus(
        updatedAssignedStats[i],
        stat.finalTotal
      ),
    }));
    setStats(updatedStatsWithBonuses);
  };

  // Calculate bonuses from race and subrace
  const calculateBonus = (ability: string | null, baseStat: number) => {
    let bonus = 0;

    // Check for race bonuses
    if (race && race.ability_bonuses) {
      race.ability_bonuses.forEach((raceBonus: any) => {
        if (
          ability != null &&
          raceBonus.ability_score.index ===
            ability.substring(0, 3).toLowerCase()
        ) {
          bonus += raceBonus.bonus;
        }
      });
    }

    // Check for subrace bonuses
    if (subRace && subRace.ability_bonuses) {
      subRace.ability_bonuses.forEach((subraceBonus: any) => {
        if (
          ability != null &&
          subraceBonus.ability_score.index ===
            ability.substring(0, 3).toLowerCase()
        ) {
          bonus += subraceBonus.bonus;
        }
      });
    }

    return baseStat + bonus;
  };

  // Handle race selection, allowing deselection (reset to no race)
  const handleRaceSelect = (selectedRace: any) => {
    console.log(selectedRace);
    if (selectedRace === "") {
      setRace(null); // Deselect race
      setSubRace(null); // Reset subrace
    } else {
      setRace(selectedRace);
      setSubRace(null); // Reset subrace when new race is selected
    }

    // Recalculate stats based on race change
    const updatedStatsWithRaceBonus = stats.map((stat, i) => ({
      ...stat,
      finalTotalWithBonus: calculateBonus(assignedStats[i], stat.finalTotal),
    }));
    setStats(updatedStatsWithRaceBonus);
  };

  // Handle subrace selection, allowing deselection (reset to no subrace)
  const handleSubRaceSelect = (selectedSubRace: any) => {
    setSubRace(selectedSubRace === "" ? null : selectedSubRace);

    // Recalculate stats based on subrace change
    const updatedStatsWithSubRaceBonus = stats.map((stat, i) => ({
      ...stat,
      finalTotalWithBonus: calculateBonus(assignedStats[i], stat.finalTotal),
    }));
    setStats(updatedStatsWithSubRaceBonus);
  };

  // Calculate final modifier for a given total
  const calculateModifier = (total: number) => {
    const modifier = Math.floor((total - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : modifier;
  };

  return (
    <div className="container mt-4 text-white bg-dark">
      <h1 className="text-center">JT Rules D&D Stat Roller</h1>

      {/* Race Selector */}
      <RaceSelector onSelect={handleRaceSelect} />

      {/* Only show SubRaceSelector if race has sub-races */}
      {race && race.subraces && race.subraces.length > 0 && (
        <SubRaceSelector race={race.index} onSelect={handleSubRaceSelect} />
      )}

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
                            Dice {i + 1}: Rerolled {reroll.length} time
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
                      <strong>Final Total:</strong> {stat.finalTotal} <br />
                      <strong>With Bonuses:</strong>{" "}
                      {assignedStats[index]
                        ? calculateBonus(assignedStats[index], stat.finalTotal)
                        : stat.finalTotal}
                      <br />
                      <strong>Modifier:</strong>{" "}
                      {assignedStats[index]
                        ? calculateModifier(
                            calculateBonus(
                              assignedStats[index],
                              stat.finalTotal
                            )
                          )
                        : calculateModifier(stat.finalTotal)}
                    </p>

                    {/* Ability Selector */}
                    <select
                      className="form-select mt-2"
                      value={assignedStats[index] || ""}
                      onChange={(e) =>
                        handleAbilitySelect(index, e.target.value)
                      }
                    >
                      <option value="">Assign Ability...</option>
                      {getAvailableAbilities(index).map((ability) => (
                        <option key={ability} value={ability}>
                          {ability}
                        </option>
                      ))}
                    </select>

                    <button
                      className="btn btn-light mt-3"
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
