const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function contingencyFeeSplit({ settlementAmount, contingencyPercent, caseCosts = 0, costsDeductedBeforeFee = false, referralFeePercent = 0, hoursWorked = 0 }) {
  num(settlementAmount, "Settlement amount"); num(contingencyPercent, "Contingency percentage"); num(caseCosts, "Case costs"); num(referralFeePercent, "Referral fee percentage"); num(hoursWorked, "Hours worked");
  if (typeof costsDeductedBeforeFee !== "boolean") throw new Error("Costs deducted before the fee must be true or false.");
  if (contingencyPercent > 100) throw new Error("Contingency percentage must be 100 or less.");
  if (referralFeePercent > 100) throw new Error("Referral fee percentage must be 100 or less.");
  if (caseCosts > settlementAmount) throw new Error("Case costs cannot be more than the settlement amount.");
  const feeBase = costsDeductedBeforeFee ? settlementAmount - caseCosts : settlementAmount;
  const grossFee = feeBase * (contingencyPercent / 100);
  const referralFee = grossFee * (referralFeePercent / 100);
  const netFeeToFirm = grossFee - referralFee;
  return {
    feeBase: round2(feeBase), grossFee: round2(grossFee), referralFee: round2(referralFee), netFeeToFirm: round2(netFeeToFirm),
    netToClient: round2(settlementAmount - grossFee - caseCosts),
    effectiveHourlyRate: hoursWorked > 0 ? round2(netFeeToFirm / hoursWorked) : null,
  };
}
