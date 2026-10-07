const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function costPerPolicyAcquired({ marketingSpend, leadCosts = 0, producerHours = 0, producerCostPerHour = 0, policiesWritten, firstYearCommissionPerPolicy = 0, renewalCommissionPerPolicy = 0, retentionPercent = 100, yearsRetained = 1 }) {
  num(marketingSpend, "Marketing spend"); num(leadCosts, "Lead costs"); num(producerHours, "Producer hours"); num(producerCostPerHour, "Producer cost per hour"); num(policiesWritten, "Policies written");
  num(firstYearCommissionPerPolicy, "First-year commission per policy"); num(renewalCommissionPerPolicy, "Renewal commission per policy"); num(retentionPercent, "Retention percentage"); num(yearsRetained, "Years retained");
  if (policiesWritten === 0) throw new Error("Policies written must be more than 0.");
  if (retentionPercent > 100) throw new Error("Retention percentage must be between 0 and 100.");
  if (yearsRetained < 1 || !Number.isInteger(yearsRetained)) throw new Error("Years retained must be a whole number of 1 or more.");
  const total = marketingSpend + leadCosts + producerHours * producerCostPerHour;
  const cost = total / policiesWritten;
  const keep = retentionPercent / 100;
  let renewalYears = 0;
  for (let n = 1; n <= yearsRetained - 1; n += 1) renewalYears += keep ** n;
  const lifetime = firstYearCommissionPerPolicy + renewalCommissionPerPolicy * renewalYears;
  return {
    totalAcquisitionCost: round2(total), costPerPolicy: round2(cost), lifetimeCommission: round2(lifetime),
    valueToCostRatio: cost > 0 ? round2(lifetime / cost) : null,
    paybackPolicies: firstYearCommissionPerPolicy > 0 ? round2(total / firstYearCommissionPerPolicy) : null,
  };
}
