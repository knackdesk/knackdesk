const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function rentalCashFlow({ monthlyRent, vacancyPercent = 0, monthlyExpenses = 0, mortgagePayment = 0 }) {
  if (num(monthlyRent, "Monthly rent") <= 0) throw new Error("Monthly rent must be above zero.");
  if (num(vacancyPercent, "Vacancy") >= 100) throw new Error("Vacancy must be below 100 percent.");
  num(monthlyExpenses, "Monthly expenses"); num(mortgagePayment, "Mortgage payment");
  const effectiveRent = round2(monthlyRent * (1 - vacancyPercent / 100));
  const monthlyNoi = round2(effectiveRent - monthlyExpenses);
  const cashFlow = round2(monthlyNoi - mortgagePayment);
  return { effectiveRent, monthlyNoi, cashFlow, annualCashFlow: round2(cashFlow * 12), annualNoi: round2(monthlyNoi * 12), expenseRatioPercent: effectiveRent > 0 ? round2((monthlyExpenses / effectiveRent) * 100) : null };
}
