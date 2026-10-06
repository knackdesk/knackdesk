const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function salonServicePrice({ monthlyOverhead, monthlyIncomeGoal, billableHoursPerMonth, serviceMinutes, productCost = 0, marginPercent = 0 }) {
  num(monthlyOverhead, "Monthly overhead"); num(monthlyIncomeGoal, "Monthly income goal"); num(productCost, "Product cost"); num(marginPercent, "Margin percentage");
  if (num(billableHoursPerMonth, "Billable hours per month") <= 0) throw new Error("Billable hours per month must be more than 0.");
  if (num(serviceMinutes, "Service minutes") <= 0) throw new Error("Service minutes must be more than 0.");
  const hourly = (monthlyOverhead + monthlyIncomeGoal) / billableHoursPerMonth;
  const timeCost = (hourly * serviceMinutes) / 60;
  const floor = timeCost + productCost;
  return { targetHourlyRate: round2(hourly), timeCost: round2(timeCost), floorPrice: round2(floor), price: round2(floor * (1 + marginPercent / 100)) };
}
