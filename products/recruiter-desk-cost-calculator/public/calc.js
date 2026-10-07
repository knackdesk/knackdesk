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
export function recruiterDeskCost({ recruiterSalary, benefitsPercent = 0, toolsAndJobBoardsAnnual = 0, overheadAllocationAnnual = 0, placementsPerYear, averageNetFee = 0 }) {
  num(recruiterSalary, "Recruiter salary"); num(benefitsPercent, "Benefits percentage"); num(toolsAndJobBoardsAnnual, "Tools and job boards"); num(overheadAllocationAnnual, "Overhead allocation"); positive(placementsPerYear, "Placements per year"); num(averageNetFee, "Average net fee");
  const loadedSalary = recruiterSalary * (1 + benefitsPercent / 100);
  const totalDeskCost = loadedSalary + toolsAndJobBoardsAnnual + overheadAllocationAnnual;
  const revenue = placementsPerYear * averageNetFee;
  return {
    loadedSalary: round2(loadedSalary), totalDeskCost: round2(totalDeskCost), costPerPlacement: round2(totalDeskCost / placementsPerYear),
    revenue: round2(revenue), deskProfit: round2(revenue - totalDeskCost),
    breakEvenPlacements: averageNetFee > 0 ? round2(totalDeskCost / averageNetFee) : null,
    revenuePerCostUnit: totalDeskCost > 0 ? round2(revenue / totalDeskCost) : 0,
  };
}
