const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function laborCostPercent({ scheduledHours, averageWage, payrollTaxPercent = 0, projectedSales, targetPercent = 0 }) {
  num(scheduledHours, "Scheduled hours"); num(payrollTaxPercent, "Payroll tax percentage"); num(targetPercent, "Target percentage");
  if (num(averageWage, "Average wage") <= 0) throw new Error("Average wage must be more than 0.");
  if (num(projectedSales, "Projected sales") <= 0) throw new Error("Projected sales must be more than 0.");
  const costPerHour = averageWage * (1 + payrollTaxPercent / 100);
  const laborCost = scheduledHours * costPerHour;
  const allowed = projectedSales * (targetPercent / 100);
  const hoursAllowed = allowed / costPerHour;
  return { laborCost: round2(laborCost), laborPercent: round2((laborCost / projectedSales) * 100), allowedLaborCost: round2(allowed), hoursAllowed: round2(hoursAllowed), hoursOver: round2(Math.max(0, scheduledHours - hoursAllowed)) };
}
