const round2 = (n) => Math.round(n * 100) / 100;
const PERIODS = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 };
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function accrual({ annualDays, frequency, periodsElapsed, carriedOver = 0, taken = 0 }) {
  num(annualDays, "Annual entitlement");
  const periodsPerYear = PERIODS[frequency];
  if (!periodsPerYear) throw new Error("Pay frequency must be weekly, biweekly, semimonthly or monthly.");
  if (num(periodsElapsed, "Periods elapsed") > periodsPerYear) throw new Error(`Periods elapsed cannot exceed ${periodsPerYear} for ${frequency} pay.`);
  num(carriedOver, "Carried over"); num(taken, "Days taken");
  const perPeriodExact = annualDays / periodsPerYear;
  const accruedToDate = round2(perPeriodExact * periodsElapsed);
  return { periodsPerYear, perPeriod: round2(perPeriodExact), accruedToDate, balance: round2(carriedOver + accruedToDate - taken), remainingThisYear: round2(annualDays - accruedToDate) };
}
