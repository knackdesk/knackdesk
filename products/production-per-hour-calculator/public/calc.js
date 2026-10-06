const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function productionPerHour({ grossProduction, adjustments = 0, hoursWorked, daysWorked = 0, overheadPerHour = 0 }) {
  num(grossProduction, "Gross production"); num(adjustments, "Adjustments"); num(hoursWorked, "Hours worked"); num(daysWorked, "Days worked"); num(overheadPerHour, "Overhead per hour");
  if (hoursWorked === 0) throw new Error("Hours worked must be more than 0.");
  if (adjustments > grossProduction) throw new Error("Adjustments cannot exceed gross production.");
  const netProduction = grossProduction - adjustments;
  const perHour = netProduction / hoursWorked;
  return {
    netProduction: round2(netProduction), productionPerHour: round2(perHour),
    productionPerDay: daysWorked > 0 ? round2(netProduction / daysWorked) : null,
    profitPerHour: round2(perHour - overheadPerHour),
  };
}
