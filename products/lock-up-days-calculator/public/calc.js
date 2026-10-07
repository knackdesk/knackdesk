const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function lockUpDays({ unbilledWip, accountsReceivable, annualFees, daysInYear = 365 }) {
  num(unbilledWip, "Unbilled work in progress"); num(accountsReceivable, "Accounts receivable"); num(annualFees, "Annual fees"); num(daysInYear, "Days in year");
  if (annualFees === 0) throw new Error("Annual fees must be more than 0.");
  if (daysInYear === 0) throw new Error("Days in year must be more than 0.");
  const dailyFees = annualFees / daysInYear;
  const wipDays = unbilledWip / dailyFees;
  const debtorDays = accountsReceivable / dailyFees;
  return {
    dailyFees: round2(dailyFees), wipDays: round2(wipDays), debtorDays: round2(debtorDays), lockUpDays: round2(wipDays + debtorDays),
    lockedUpCash: round2(unbilledWip + accountsReceivable), cashPerDayOfLockUp: round2(dailyFees),
  };
}
