const round2 = (n) => Math.round(n * 100) / 100;

function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}

export function hourlyRate({ targetIncome, annualExpenses = 0, weeksOff = 0, hoursPerWeek, billablePercent, taxPercent = 0, hoursPerDay = 8 }) {
  num(targetIncome, "Target income");
  num(annualExpenses, "Expenses");
  num(hoursPerWeek, "Hours per week");
  if (num(taxPercent, "Tax") >= 100) throw new Error("Tax percent must be below 100.");
  const workingWeeks = 52 - num(weeksOff, "Weeks off");
  if (workingWeeks <= 0) throw new Error("Weeks off must leave at least one working week.");
  const billableHours = round2(workingWeeks * hoursPerWeek * (num(billablePercent, "Billable percent") / 100));
  if (billableHours <= 0) throw new Error("Billable hours come out to zero; raise hours or billable percent.");
  const revenueNeeded = round2(annualExpenses + targetIncome / (1 - taxPercent / 100));
  const hourly = round2(revenueNeeded / billableHours);
  return { workingWeeks, totalHours: workingWeeks * hoursPerWeek, billableHours, revenueNeeded, hourly, day: round2(hourly * hoursPerDay) };
}
