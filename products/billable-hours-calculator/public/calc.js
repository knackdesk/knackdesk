const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function billableTarget({ revenueGoal, hourlyRate, weeksWorked = 46, hoursPerWeek = 40, daysPerWeek = 5 }) {
  num(revenueGoal, "Revenue goal");
  if (num(hourlyRate, "Hourly rate") <= 0) throw new Error("Hourly rate must be above zero.");
  if (num(weeksWorked, "Weeks worked") <= 0 || weeksWorked > 52) throw new Error("Weeks worked must be between 1 and 52.");
  if (num(hoursPerWeek, "Hours per week") <= 0) throw new Error("Hours per week must be above zero.");
  if (num(daysPerWeek, "Days per week") <= 0 || daysPerWeek > 7) throw new Error("Days per week must be between 1 and 7.");
  const hoursNeeded = revenueGoal / hourlyRate;
  const perWeek = hoursNeeded / weeksWorked;
  const utilizationPercent = round2((perWeek / hoursPerWeek) * 100);
  return { hoursNeeded: round2(hoursNeeded), perWeek: round2(perWeek), perDay: round2(perWeek / daysPerWeek), utilizationPercent, feasible: utilizationPercent <= 100, spareHoursPerWeek: round2(Math.max(0, hoursPerWeek - perWeek)) };
}
