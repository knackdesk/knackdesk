const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function vacancyRate({ units, vacantUnits, averageMonthlyRent = 0 }) {
  if (num(units, "Units") <= 0) throw new Error("Units must be above zero.");
  num(vacantUnits, "Vacant units"); num(averageMonthlyRent, "Average rent");
  if (vacantUnits > units) throw new Error("Vacant units cannot exceed total units.");
  const vacancyPercent = round2((vacantUnits / units) * 100);
  const lostRentPerMonth = round2(vacantUnits * averageMonthlyRent);
  return { vacancyPercent, occupancyPercent: round2(100 - vacancyPercent), lostRentPerMonth, lostRentPerYear: round2(lostRentPerMonth * 12), collectedPerMonth: round2((units - vacantUnits) * averageMonthlyRent), potentialPerMonth: round2(units * averageMonthlyRent) };
}
