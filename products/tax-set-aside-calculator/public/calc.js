const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
const MONTHS = { month: 1, quarter: 3, year: 12 };
export function taxSetAside({ income, expenses = 0, setAsidePercent, period = "month" }) {
  num(income, "Income"); num(expenses, "Expenses");
  if (num(setAsidePercent, "Set-aside percent") > 100) throw new Error("Set-aside percent cannot exceed 100.");
  const months = MONTHS[period];
  if (!months) throw new Error("Period must be month, quarter or year.");
  const profit = round2(income - expenses);
  const setAside = round2(Math.max(0, profit) * (setAsidePercent / 100));
  const perMonth = setAside / months;
  return { profit, setAside, perMonth: round2(perMonth), perQuarter: round2(perMonth * 3), perYear: round2(perMonth * 12), keepPercent: round2(100 - setAsidePercent) };
}
