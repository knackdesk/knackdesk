const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function pct(v, name) {
  num(v, name);
  if (v > 100) throw new Error(`${name} must be 100 or less.`);
  return v;
}
export function placementFee({ annualSalary, feePercent, recruiterHours = 0, recruiterCostPerHour = 0, advertisingCosts = 0, splitPercent = 0 }) {
  num(annualSalary, "Annual salary"); pct(feePercent, "Fee percentage"); num(recruiterHours, "Recruiter hours"); num(recruiterCostPerHour, "Recruiter cost per hour"); num(advertisingCosts, "Advertising costs"); pct(splitPercent, "Split percentage");
  const grossFee = annualSalary * feePercent / 100;
  const splitFee = grossFee * splitPercent / 100;
  const netFee = grossFee - splitFee;
  const deliveryCost = recruiterHours * recruiterCostPerHour + advertisingCosts;
  const marginOnPlacement = netFee - deliveryCost;
  return {
    grossFee: round2(grossFee), splitFee: round2(splitFee), netFee: round2(netFee), deliveryCost: round2(deliveryCost),
    marginOnPlacement: round2(marginOnPlacement), marginPercent: netFee > 0 ? round2((marginOnPlacement / netFee) * 100) : 0,
    effectiveHourlyRate: recruiterHours > 0 ? round2(netFee / recruiterHours) : null,
  };
}
