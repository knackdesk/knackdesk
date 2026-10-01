const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function jobQuote({ materials = 0, laborHours = 0, hourlyRate = 0, subcontractors = 0, overheadPercent = 0, marginPercent = 0 }) {
  num(materials, "Materials"); num(laborHours, "Labour hours"); num(hourlyRate, "Hourly rate"); num(subcontractors, "Subcontractors"); num(overheadPercent, "Overhead");
  if (num(marginPercent, "Profit margin") >= 100) throw new Error("Profit margin must be below 100 percent of the price.");
  const laborCost = round2(laborHours * hourlyRate);
  const directCost = round2(materials + laborCost + subcontractors);
  const overhead = round2(directCost * (overheadPercent / 100));
  const totalCost = round2(directCost + overhead);
  const price = round2(totalCost / (1 - marginPercent / 100));
  const profit = round2(price - totalCost);
  return { laborCost, directCost, overhead, totalCost, price, profit, markupPercent: totalCost > 0 ? round2((profit / totalCost) * 100) : null };
}
