const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function capRate({ purchasePrice, annualRent, vacancyPercent = 0, operatingExpenses = 0 }) {
  if (num(purchasePrice, "Purchase price") <= 0) throw new Error("Purchase price must be above zero.");
  num(annualRent, "Annual rent"); num(operatingExpenses, "Operating expenses");
  if (num(vacancyPercent, "Vacancy") >= 100) throw new Error("Vacancy must be below 100 percent.");
  const vacancyLoss = round2(annualRent * (vacancyPercent / 100));
  const effectiveIncome = round2(annualRent - vacancyLoss);
  const noi = round2(effectiveIncome - operatingExpenses);
  return { vacancyLoss, effectiveIncome, noi, capRatePercent: round2((noi / purchasePrice) * 100), expenseRatioPercent: effectiveIncome > 0 ? round2((operatingExpenses / effectiveIncome) * 100) : null, monthlyNoi: round2(noi / 12) };
}
export function priceForCapRate({ noi, targetCapPercent }) {
  if (typeof noi !== "number" || !Number.isFinite(noi)) throw new Error("NOI must be a number.");
  if (num(targetCapPercent, "Target cap rate") <= 0) throw new Error("Target cap rate must be above zero.");
  return round2(noi / (targetCapPercent / 100));
}
