const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function projectProfit({ price, hours, costPerHour, expenses = 0 }) {
  if (num(price, "Price") <= 0) throw new Error("Price must be above zero.");
  if (num(hours, "Hours") <= 0) throw new Error("Hours must be above zero.");
  num(costPerHour, "Cost per hour"); num(expenses, "Expenses");
  const laborCost = round2(hours * costPerHour);
  const totalCost = round2(laborCost + expenses);
  const profit = round2(price - totalCost);
  return { laborCost, totalCost, profit, marginPercent: round2((profit / price) * 100), effectiveRate: round2(price / hours), breakEvenHours: costPerHour > 0 ? round2((price - expenses) / costPerHour) : null };
}
