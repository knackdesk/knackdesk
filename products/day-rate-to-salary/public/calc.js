const round2 = (n) => Math.round(n * 100) / 100;

function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}

function checkCommon(billableDays, overheadPercent, hoursPerDay) {
  if (num(billableDays, "Billable days") <= 0) throw new Error("Billable days must be above zero.");
  if (num(overheadPercent, "Overhead percent") >= 100) throw new Error("Overhead percent must be below 100.");
  if (num(hoursPerDay, "Hours per day") <= 0) throw new Error("Hours in a day must be above zero.");
}

export function dayRateToSalary({ dayRate, billableDays, overheadPercent = 0, hoursPerDay = 8 }) {
  num(dayRate, "Day rate");
  checkCommon(billableDays, overheadPercent, hoursPerDay);
  const contractorRevenue = round2(dayRate * billableDays);
  return { contractorRevenue, equivalentSalary: round2(contractorRevenue / (1 + overheadPercent / 100)), hourlyRate: round2(dayRate / hoursPerDay) };
}

export function salaryToDayRate({ salary, billableDays, overheadPercent = 0, hoursPerDay = 8 }) {
  num(salary, "Salary");
  checkCommon(billableDays, overheadPercent, hoursPerDay);
  const revenueNeeded = round2(salary * (1 + overheadPercent / 100));
  const dayRate = round2(revenueNeeded / billableDays);
  return { revenueNeeded, dayRate, hourlyRate: round2(dayRate / hoursPerDay) };
}
