const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function timekeeperCostRate({ annualSalary, benefitsPercent = 0, overheadAllocationAnnual = 0, billableHoursPerYear, billRate = 0 }) {
  num(annualSalary, "Annual salary"); num(benefitsPercent, "Benefits percentage"); num(overheadAllocationAnnual, "Overhead allocation"); num(billableHoursPerYear, "Billable hours per year"); num(billRate, "Bill rate");
  if (billableHoursPerYear === 0) throw new Error("Billable hours per year must be more than 0.");
  const loadedSalary = annualSalary * (1 + benefitsPercent / 100);
  const totalAnnualCost = loadedSalary + overheadAllocationAnnual;
  const costRate = totalAnnualCost / billableHoursPerYear;
  const marginPerHour = billRate - costRate;
  return {
    loadedSalary: round2(loadedSalary), totalAnnualCost: round2(totalAnnualCost), costRate: round2(costRate), marginPerHour: round2(marginPerHour),
    marginPercent: billRate > 0 ? round2((marginPerHour / billRate) * 100) : 0,
    breakEvenHours: billRate > 0 ? round2(totalAnnualCost / billRate) : null,
  };
}
