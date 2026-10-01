const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function craftPrice({ materials, laborHours = 0, hourlyRate = 0, overheadPercent = 0, wholesaleMarkup = 2, retailMarkup = 2 }) {
  num(materials, "Materials"); num(laborHours, "Labour hours"); num(hourlyRate, "Hourly rate"); num(overheadPercent, "Overhead");
  if (typeof wholesaleMarkup !== "number" || !Number.isFinite(wholesaleMarkup) || wholesaleMarkup < 1) throw new Error("Wholesale markup must be 1 or more (1 = sell at cost).");
  if (typeof retailMarkup !== "number" || !Number.isFinite(retailMarkup) || retailMarkup < 1) throw new Error("Retail markup must be 1 or more (1 = same as wholesale).");
  const laborCost = round2(laborHours * hourlyRate);
  const baseCost = round2(materials + laborCost);
  const overhead = round2(baseCost * (overheadPercent / 100));
  const totalCost = round2(baseCost + overhead);
  const wholesale = round2(totalCost * wholesaleMarkup);
  const retail = round2(wholesale * retailMarkup);
  return { laborCost, baseCost, overhead, totalCost, wholesale, retail, wholesaleProfit: round2(wholesale - totalCost), retailProfit: round2(retail - totalCost) };
}
