const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function positive(v, name) {
  num(v, name);
  if (v === 0) throw new Error(`${name} must be more than 0.`);
  return v;
}
export function homeCareBillRate({ caregiverPayRate, onCostsPercent = 0, nonBillablePaidPercent = 0, overheadMonthly = 0, billableHoursMonthly, marginPercent = 0 }) {
  num(caregiverPayRate, "Caregiver pay rate"); num(onCostsPercent, "On-costs percentage"); num(nonBillablePaidPercent, "Non-billable paid time percentage"); num(overheadMonthly, "Monthly overhead"); positive(billableHoursMonthly, "Billable hours per month"); num(marginPercent, "Margin percentage");
  if (marginPercent >= 100) throw new Error("Margin percentage must be less than 100.");
  const loadedPayRate = caregiverPayRate * (1 + onCostsPercent / 100);
  const labourCostPerBillableHour = loadedPayRate * (1 + nonBillablePaidPercent / 100);
  const overheadPerBillableHour = overheadMonthly / billableHoursMonthly;
  const costPerBillableHour = labourCostPerBillableHour + overheadPerBillableHour;
  const billRate = costPerBillableHour / (1 - marginPercent / 100);
  return {
    loadedPayRate: round2(loadedPayRate), labourCostPerBillableHour: round2(labourCostPerBillableHour), overheadPerBillableHour: round2(overheadPerBillableHour),
    costPerBillableHour: round2(costPerBillableHour), billRate: round2(billRate), marginPerHour: round2(billRate - costPerBillableHour),
  };
}
