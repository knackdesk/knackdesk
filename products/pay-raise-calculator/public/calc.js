const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function pack(oldSalary, newSalary, hoursPerWeek) {
  const difference = round2(newSalary - oldSalary);
  const hours = num(hoursPerWeek, "Hours per week") * 52;
  return { newSalary: round2(newSalary), difference, percent: round2((difference / oldSalary) * 100), monthlyDifference: round2(difference / 12), hourlyDifference: hours > 0 ? round2(difference / hours) : null };
}
export function raiseByPercent({ salary, percent, hoursPerWeek = 40 }) {
  if (num(salary, "Salary") <= 0) throw new Error("Salary must be above zero.");
  if (typeof percent !== "number" || !Number.isFinite(percent)) throw new Error("Percent must be a number.");
  return pack(salary, salary * (1 + percent / 100), hoursPerWeek);
}
export function raiseByAmount({ salary, amount, hoursPerWeek = 40 }) {
  if (num(salary, "Salary") <= 0) throw new Error("Salary must be above zero.");
  if (typeof amount !== "number" || !Number.isFinite(amount)) throw new Error("Amount must be a number.");
  return pack(salary, salary + amount, hoursPerWeek);
}
export function raiseBetween({ oldSalary, newSalary, hoursPerWeek = 40 }) {
  if (num(oldSalary, "Old salary") <= 0) throw new Error("Old salary must be above zero.");
  num(newSalary, "New salary");
  return pack(oldSalary, newSalary, hoursPerWeek);
}
