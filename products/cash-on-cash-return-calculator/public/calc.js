const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function cashOnCash({ cashInvested, annualNoi, annualDebtService = 0 }) {
  if (num(cashInvested, "Cash invested") <= 0) throw new Error("Cash invested must be above zero.");
  if (typeof annualNoi !== "number" || !Number.isFinite(annualNoi)) throw new Error("Net operating income must be a number.");
  num(annualDebtService, "Annual debt service");
  const annualCashFlow = round2(annualNoi - annualDebtService);
  return { annualCashFlow, monthlyCashFlow: round2(annualCashFlow / 12), cocPercent: round2((annualCashFlow / cashInvested) * 100), yearsToRecoverCash: annualCashFlow > 0 ? round2(cashInvested / annualCashFlow) : null };
}
