import React, { useEffect, useState } from "react";
import axios from "axios";

interface SubRace {
  index: string;
  name: string;
  ability_bonuses: any[]; // Array of ability bonuses
}

interface SubRaceSelectorProps {
  race: string; // The selected race index
  onSelect: (subRace: SubRace) => void;
}

const SubRaceSelector: React.FC<SubRaceSelectorProps> = ({
  race,
  onSelect,
}) => {
  const [subRaces, setSubRaces] = useState<SubRace[]>([]);
  const [selectedSubRace, setSelectedSubRace] = useState<string>("");

  useEffect(() => {
    // Fetch subraces for the selected race
    const fetchSubRaces = async () => {
      try {
        const response = await axios.get(
          `https://www.dnd5eapi.co/api/races/${race}`
        );
        const subRaceData = await Promise.all(
          response.data.subraces.map(async (subrace: any) => {
            const subRaceDetails = await axios.get(
              `https://www.dnd5eapi.co${subrace.url}`
            );
            return {
              index: subRaceDetails.data.index,
              name: subRaceDetails.data.name,
              ability_bonuses: subRaceDetails.data.ability_bonuses,
            };
          })
        );
        setSubRaces(subRaceData);
      } catch (error) {
        console.error("Error fetching subraces:", error);
      }
    };

    if (race) {
      fetchSubRaces();
    }
  }, [race]);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedSubRace(selected);
    const subRace = subRaces.find((sr) => sr.index === selected);
    if (subRace) {
      onSelect(subRace);
    }
  };

  const formatBonusText = (abilityBonuses: any[]) => {
    if (!abilityBonuses || abilityBonuses.length === 0) return "";
    return abilityBonuses
      .map(
        (bonus) =>
          `${bonus.ability_score.name.substring(0, 3).toUpperCase()} +${
            bonus.bonus
          }`
      )
      .join(", ");
  };

  return (
    <div className="mb-3">
      <select
        id="subrace-select"
        className="form-select"
        value={selectedSubRace}
        onChange={handleSelect}
      >
        <option value="">Choose a sub-race...</option>
        {subRaces.map((subRace) => (
          <option key={subRace.index} value={subRace.index}>
            {subRace.name} ({formatBonusText(subRace.ability_bonuses)})
          </option>
        ))}
      </select>
    </div>
  );
};

export default SubRaceSelector;
