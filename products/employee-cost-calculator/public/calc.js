const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function employeeCost({ salary, employerTaxPercent = 0, benefits = 0, overheads = 0, weeksWorked = 46, hoursPerWeek = 40, productivePercent = 100 }) {
  num(salary, "Salary"); num(employerTaxPercent, "Employer taxes"); num(benefits, "Benefits"); num(overheads, "Overheads");
  num(weeksWorked, "Weeks worked"); num(hoursPerWeek, "Hours per week");
  if (num(productivePercent, "Productive share") > 100) throw new Error("Productive share cannot exceed 100 percent.");
  const employerTaxes = round2(salary * (employerTaxPercent / 100));
  const totalAnnual = round2(salary + employerTaxes + benefits + overheads);
  const productiveHours = round2(weeksWorked * hoursPerWeek * (productivePercent / 100));
  if (productiveHours <= 0) throw new Error("Productive hours come out to zero; check weeks, hours and productive share.");
  return { employerTaxes, totalAnnual, totalMonthly: round2(totalAnnual / 12), productiveHours, costPerProductiveHour: round2(totalAnnual / productiveHours), multiplier: salary > 0 ? round2(totalAnnual / salary) : 0 };
}
