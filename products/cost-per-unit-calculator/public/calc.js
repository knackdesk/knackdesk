const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function costPerUnit({ ingredients, packaging = 0, laborHours = 0, hourlyRate = 0, other = 0, unitsMade, wastePercent = 0 }) {
  num(ingredients, "Ingredients or materials"); num(packaging, "Packaging"); num(laborHours, "Labour hours"); num(hourlyRate, "Hourly rate"); num(other, "Other costs");
  if (num(unitsMade, "Units made") <= 0) throw new Error("Units made must be above zero.");
  if (num(wastePercent, "Waste") >= 100) throw new Error("Waste must be below 100 percent.");
  const laborCost = round2(laborHours * hourlyRate);
  const batchCost = round2(ingredients + packaging + laborCost + other);
  const usableUnits = round2(unitsMade * (1 - wastePercent / 100));
  return { laborCost, batchCost, usableUnits, perUnit: round2(batchCost / usableUnits), perUnitBeforeWaste: round2(batchCost / unitsMade) };
}
