const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function blendedRate(rows) {
  if (!Array.isArray(rows) || rows.length === 0) throw new Error("Enter at least one role with hours.");
  let totalHours = 0, totalCost = 0;
  for (const { hours, rate } of rows) {
    num(hours, "Hours"); num(rate, "Rate");
    totalHours += hours; totalCost += hours * rate;
  }
  if (totalHours <= 0) throw new Error("Total hours must be above zero.");
  return { totalHours: round2(totalHours), totalCost: round2(totalCost), blended: round2(totalCost / totalHours) };
}
