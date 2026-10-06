const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function bookkeepingPackagePrice({ baseFee, transactionsPerMonth = 0, perTransactionRate = 0, bankAccounts = 0, perAccountFee = 0, addOns = 0, estimatedHours = 0 }) {
  num(baseFee, "Base fee"); num(transactionsPerMonth, "Transactions per month"); num(perTransactionRate, "Rate per transaction");
  num(bankAccounts, "Bank and card accounts"); num(perAccountFee, "Fee per account"); num(addOns, "Add-ons"); num(estimatedHours, "Estimated hours");
  const transactionCharge = transactionsPerMonth * perTransactionRate;
  const accountCharge = bankAccounts * perAccountFee;
  const monthlyFee = baseFee + transactionCharge + accountCharge + addOns;
  const effectiveHourlyRate = estimatedHours > 0 ? round2(monthlyFee / estimatedHours) : null;
  return { transactionCharge: round2(transactionCharge), accountCharge: round2(accountCharge), monthlyFee: round2(monthlyFee), annualFee: round2(monthlyFee * 12), effectiveHourlyRate };
}
