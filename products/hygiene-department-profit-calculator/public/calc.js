const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function hygieneDepartmentProfit({ hygieneProduction, hygienistWages, payrollTaxPercent = 0, suppliesCost = 0, hygienistHours, overheadAllocation = 0 }) {
  num(hygieneProduction, "Hygiene production"); num(hygienistWages, "Hygienist wages"); num(payrollTaxPercent, "Payroll tax percentage"); num(suppliesCost, "Supplies cost"); num(hygienistHours, "Hygienist hours"); num(overheadAllocation, "Overhead allocation");
  if (payrollTaxPercent > 100) throw new Error("Payroll tax percentage must be between 0 and 100.");
  if (hygienistHours === 0) throw new Error("Hygienist hours must be more than 0.");
  const loadedWages = hygienistWages * (1 + payrollTaxPercent / 100);
  const totalCost = loadedWages + suppliesCost + overheadAllocation;
  const departmentProfit = hygieneProduction - totalCost;
  return {
    loadedWages: round2(loadedWages), totalCost: round2(totalCost), departmentProfit: round2(departmentProfit),
    marginPercent: hygieneProduction > 0 ? round2((departmentProfit / hygieneProduction) * 100) : 0,
    productionPerHour: round2(hygieneProduction / hygienistHours), costPerHour: round2(totalCost / hygienistHours),
  };
}
