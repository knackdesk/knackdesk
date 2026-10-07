const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function flatFeeMatterPrice({ partnerHours = 0, partnerCostRate = 0, associateHours = 0, associateCostRate = 0, paralegalHours = 0, paralegalCostRate = 0, disbursements = 0, contingencyPercent = 0, marginPercent = 0 }) {
  num(partnerHours, "Partner hours"); num(partnerCostRate, "Partner cost rate"); num(associateHours, "Associate hours"); num(associateCostRate, "Associate cost rate"); num(paralegalHours, "Paralegal hours"); num(paralegalCostRate, "Paralegal cost rate");
  num(disbursements, "Disbursements"); num(contingencyPercent, "Contingency percentage"); num(marginPercent, "Margin percentage");
  if (marginPercent >= 100) throw new Error("Margin percentage must be less than 100, because the margin is a share of the fee.");
  const labourCost = partnerHours * partnerCostRate + associateHours * associateCostRate + paralegalHours * paralegalCostRate;
  const costWithContingency = labourCost * (1 + contingencyPercent / 100);
  const totalCost = costWithContingency + disbursements;
  const flatFee = totalCost / (1 - marginPercent / 100);
  const totalHours = partnerHours + associateHours + paralegalHours;
  return {
    labourCost: round2(labourCost), costWithContingency: round2(costWithContingency), totalCost: round2(totalCost), flatFee: round2(flatFee), totalHours: round2(totalHours),
    effectiveHourlyRate: totalHours > 0 ? round2(flatFee / totalHours) : null,
  };
}
