const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function itContractMargin({ monthlyFee, seats = 0, toolCostsMonthly = 0, labourHoursMonthly, loadedHourlyCost, otherCostsMonthly = 0 }) {
  num(monthlyFee, "Monthly fee"); num(seats, "Seats"); num(toolCostsMonthly, "Tool costs"); num(labourHoursMonthly, "Labour hours"); num(loadedHourlyCost, "Loaded hourly cost"); num(otherCostsMonthly, "Other costs");
  const labourCost = labourHoursMonthly * loadedHourlyCost;
  const totalCost = toolCostsMonthly + labourCost + otherCostsMonthly;
  const grossProfit = monthlyFee - totalCost;
  return {
    labourCost: round2(labourCost), totalCost: round2(totalCost), grossProfit: round2(grossProfit),
    marginPercent: monthlyFee > 0 ? round2((grossProfit / monthlyFee) * 100) : 0,
    costPerSeat: seats > 0 ? round2(totalCost / seats) : null, feePerSeat: seats > 0 ? round2(monthlyFee / seats) : null,
    breakEvenHours: loadedHourlyCost > 0 ? round2((monthlyFee - toolCostsMonthly - otherCostsMonthly) / loadedHourlyCost) : null,
  };
}
