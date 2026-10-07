const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function matterBudgetVariance({ budgetHours, budgetFees, actualHours, actualFees, agreedFee = 0 }) {
  num(budgetHours, "Budget hours"); num(budgetFees, "Budget fees"); num(actualHours, "Actual hours"); num(actualFees, "Actual fees"); num(agreedFee, "Agreed fee");
  const hoursVariance = actualHours - budgetHours;
  const feesVariance = actualFees - budgetFees;
  return {
    hoursVariance: round2(hoursVariance), hoursVariancePercent: budgetHours > 0 ? round2((hoursVariance / budgetHours) * 100) : 0,
    feesVariance: round2(feesVariance), feesVariancePercent: budgetFees > 0 ? round2((feesVariance / budgetFees) * 100) : 0,
    realizedRate: actualHours > 0 ? round2(actualFees / actualHours) : null,
    writeOff: agreedFee > 0 ? round2(Math.max(0, actualFees - agreedFee)) : null,
    recoveryPercent: agreedFee > 0 && actualFees > 0 ? round2((agreedFee / actualFees) * 100) : null,
  };
}
