const round2 = (n) => Math.round(n * 100) / 100;
function nonNeg(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function income(v) {
  if (nonNeg(v, "Monthly income") === 0) throw new Error("Monthly income must be above zero.");
  return v;
}
function target(v) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 1 || v > 100) throw new Error("Target ratio must be between 1 and 100 percent.");
  return v;
}

export function ratio({ monthlyIncome, monthlyRent }) {
  income(monthlyIncome); nonNeg(monthlyRent, "Monthly rent");
  return { percent: round2((monthlyRent / monthlyIncome) * 100) };
}
export function maxRent({ monthlyIncome, targetPercent }) {
  income(monthlyIncome); target(targetPercent);
  return { maxRent: round2(monthlyIncome * (targetPercent / 100)) };
}
export function incomeNeeded({ monthlyRent, targetPercent }) {
  nonNeg(monthlyRent, "Monthly rent"); target(targetPercent);
  return { income: round2(monthlyRent / (targetPercent / 100)) };
}
