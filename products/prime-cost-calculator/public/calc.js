const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function primeCost({ sales, foodCost = 0, beverageCost = 0, laborCost = 0 }) {
  if (num(sales, "Sales") <= 0) throw new Error("Sales must be more than 0.");
  num(foodCost, "Food cost"); num(beverageCost, "Beverage cost"); num(laborCost, "Labour cost");
  const prime = foodCost + beverageCost + laborCost;
  const pct = (v) => round2((v / sales) * 100);
  return { primeCost: round2(prime), primeCostPercent: pct(prime), foodPercent: pct(foodCost), beveragePercent: pct(beverageCost), laborPercent: pct(laborCost), remaining: round2(sales - prime) };
}
