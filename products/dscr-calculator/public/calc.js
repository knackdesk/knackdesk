const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function pmt(principal, monthlyRate, months) {
  return monthlyRate === 0 ? principal / months : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}
export function dscr({ netOperatingIncome, annualDebtService, targetRatio = 1.25 }) {
  if (typeof netOperatingIncome !== "number" || !Number.isFinite(netOperatingIncome)) throw new Error("Net operating income must be a number.");
  if (num(annualDebtService, "Annual debt service") <= 0) throw new Error("Annual debt service must be above zero.");
  if (num(targetRatio, "Target ratio") < 0.01) throw new Error("Target ratio must be at least 0.01.");
  const ratio = round2(netOperatingIncome / annualDebtService);
  const maxAnnualDebtService = round2(Math.max(0, netOperatingIncome) / targetRatio);
  return { ratio, meetsTarget: ratio >= targetRatio, maxAnnualDebtService, maxMonthlyPayment: round2(maxAnnualDebtService / 12), headroom: round2(maxAnnualDebtService - annualDebtService) };
}
