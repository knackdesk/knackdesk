const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function policyRetentionRate({ policiesAtStart, policiesLost, newPolicies = 0, averageAnnualCommission = 0 }) {
  num(policiesAtStart, "Policies at start"); num(policiesLost, "Policies lost"); num(newPolicies, "New policies"); num(averageAnnualCommission, "Average annual commission");
  if (policiesAtStart === 0) throw new Error("Policies at start must be more than 0.");
  if (policiesLost > policiesAtStart) throw new Error("Policies lost cannot be more than policies at start.");
  const kept = policiesAtStart - policiesLost;
  const retention = (kept / policiesAtStart) * 100;
  const policiesAtEnd = kept + newPolicies;
  return {
    retentionPercent: round2(retention), lapsePercent: round2(100 - retention), policiesAtEnd: round2(policiesAtEnd),
    netGrowthPercent: round2(((policiesAtEnd - policiesAtStart) / policiesAtStart) * 100),
    commissionLost: round2(policiesLost * averageAnnualCommission), commissionRetained: round2(kept * averageAnnualCommission),
  };
}
