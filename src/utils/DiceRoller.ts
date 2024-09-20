export const rollDie = (): number => Math.floor(Math.random() * 6) + 1;

export interface StatRollResult {
  rolls: number[];
  rerolls: (number[] | null)[];
  finalTotal: number;
}

export const rollStat = (): StatRollResult => {
  const rolls: number[] = [];
  const rerolls: (number[] | null)[] = [];

  // Roll 4d6 and reroll any 1s or 2s
  for (let i = 0; i < 4; i++) {
    let roll = rollDie();
    const currentRerolls: number[] = [];

    while (roll <= 2) {
      currentRerolls.push(roll);
      roll = rollDie(); // Reroll
    }

    rolls.push(roll);
    if (currentRerolls.length) {
      rerolls.push(currentRerolls);
    } else {
      rerolls.push(null); // No rerolls for this dice
    }
  }

  // Sort rolls and keep the three highest
  rolls.sort((a, b) => b - a);
  const finalTotal = rolls.slice(0, 3).reduce((acc, val) => acc + val, 0);

  return { rolls, rerolls, finalTotal };
};
