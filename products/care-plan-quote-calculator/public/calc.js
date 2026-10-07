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
export function carePlanQuote({ hoursPerWeek, billRate, weekendHours = 0, weekendUpliftPercent = 0, overnightHours = 0, overnightRate = 0, milesPerWeek = 0, mileageRate = 0, weeks = 4 }) {
  num(hoursPerWeek, "Hours per week"); num(billRate, "Bill rate"); num(weekendHours, "Weekend hours"); num(weekendUpliftPercent, "Weekend uplift percentage"); num(overnightHours, "Overnight hours"); num(overnightRate, "Overnight rate"); num(milesPerWeek, "Miles per week"); num(mileageRate, "Mileage rate"); num(weeks, "Weeks");
  if (weekendHours + overnightHours > hoursPerWeek) throw new Error("Weekend and overnight hours cannot exceed the hours per week.");
  const standardHours = hoursPerWeek - weekendHours - overnightHours;
  const standardCost = standardHours * billRate;
  const weekendCost = weekendHours * billRate * (1 + weekendUpliftPercent / 100);
  const overnightCost = overnightHours * overnightRate;
  const mileageCost = milesPerWeek * mileageRate;
  const weeklyTotal = standardCost + weekendCost + overnightCost + mileageCost;
  return {
    standardHours: round2(standardHours), standardCost: round2(standardCost), weekendCost: round2(weekendCost), overnightCost: round2(overnightCost),
    mileageCost: round2(mileageCost), weeklyTotal: round2(weeklyTotal), periodTotal: round2(weeklyTotal * weeks),
    effectiveHourlyRate: hoursPerWeek > 0 ? round2(weeklyTotal / hoursPerWeek) : null,
  };
}
