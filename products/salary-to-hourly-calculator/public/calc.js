const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function check(hoursPerWeek, weeksPerYear, daysPerWeek) {
  if (num(hoursPerWeek, "Hours per week") <= 0 || hoursPerWeek > 168) throw new Error("Hours per week must be between 1 and 168.");
  if (num(weeksPerYear, "Weeks per year") <= 0 || weeksPerYear > 52) throw new Error("Weeks per year must be between 1 and 52.");
  if (num(daysPerWeek, "Days per week") <= 0 || daysPerWeek > 7) throw new Error("Days per week must be between 1 and 7.");
}
export function fromAnnual({ annual, hoursPerWeek = 40, weeksPerYear = 52, daysPerWeek = 5 }) {
  num(annual, "Annual salary"); check(hoursPerWeek, weeksPerYear, daysPerWeek);
  const weekly = annual / weeksPerYear;
  return { annual: round2(annual), monthly: round2(annual / 12), weekly: round2(weekly), daily: round2(weekly / daysPerWeek), hourly: round2(annual / (hoursPerWeek * weeksPerYear)) };
}
export function fromHourly({ hourly, hoursPerWeek = 40, weeksPerYear = 52, daysPerWeek = 5 }) {
  num(hourly, "Hourly rate"); check(hoursPerWeek, weeksPerYear, daysPerWeek);
  return fromAnnual({ annual: hourly * hoursPerWeek * weeksPerYear, hoursPerWeek, weeksPerYear, daysPerWeek });
}
