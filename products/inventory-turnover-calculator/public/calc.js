const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function turnover({ cogs, averageInventory, openingInventory, closingInventory, periodDays = 365 }) {
  num(cogs, "Cost of goods sold");
  if (num(periodDays, "Period days") <= 0) throw new Error("Period days must be above zero.");
  let avg = averageInventory;
  if (typeof avg !== "number") {
    num(openingInventory, "Opening inventory"); num(closingInventory, "Closing inventory");
    avg = (openingInventory + closingInventory) / 2;
  }
  if (num(avg, "Average inventory") <= 0) throw new Error("Average inventory must be above zero.");
  const turns = round2(cogs / avg);
  return { averageInventory: round2(avg), turnover: turns, daysOnHand: turns > 0 ? round2(periodDays / turns) : null };
}
