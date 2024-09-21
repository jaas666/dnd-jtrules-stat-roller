import React, { useEffect, useState } from "react";
import axios from "axios";

interface Race {
  index: string;
  name: string;
  subraces: any[]; // Array of sub-races
  ability_bonuses: any[]; // Array of ability bonuses
}

interface RaceSelectorProps {
  onSelect: (race: Race) => void;
}

const RaceSelector: React.FC<RaceSelectorProps> = ({ onSelect }) => {
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRace, setSelectedRace] = useState<string>("");

  useEffect(() => {
    // Fetch races along with subraces and ability bonuses
    const fetchRaces = async () => {
      try {
        const response = await axios.get("https://www.dnd5eapi.co/api/races");
        const raceData = await Promise.all(
          response.data.results.map(async (race: any) => {
            const raceDetails = await axios.get(
              `https://www.dnd5eapi.co${race.url}`
            );
            return {
              index: race.index,
              name: race.name,
              subraces: raceDetails.data.subraces,
              ability_bonuses: raceDetails.data.ability_bonuses,
            };
          })
        );
        setRaces(raceData);
      } catch (error) {
        console.error("Error fetching races:", error);
      }
    };

    fetchRaces();
  }, []);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedRace(selected);
    const race = races.find((r) => r.index === selected);
    if (race) {
      onSelect(race);
    }
  };

  const formatBonusText = (abilityBonuses: any[]) => {
    if (!abilityBonuses || abilityBonuses.length === 0) return "";
    return abilityBonuses
      .map((bonus) => `${bonus.ability_score.name} +${bonus.bonus}`)
      .join(", ");
  };

  return (
    <div className="mb-3">
      <label htmlFor="race-select" className="form-label">
        Select Race
      </label>
      <select
        id="race-select"
        className="form-select"
        value={selectedRace}
        onChange={handleSelect}
      >
        <option value="">Choose a race...</option>
        {races.map((race) => (
          <option key={race.index} value={race.index}>
            {race.name} ({formatBonusText(race.ability_bonuses)})
          </option>
        ))}
      </select>
    </div>
  );
};

export default RaceSelector;
