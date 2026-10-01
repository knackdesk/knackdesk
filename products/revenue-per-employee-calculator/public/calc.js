const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function revenuePerEmployee({ revenue, employees, profit = 0, payroll = 0 }) {
  num(revenue, "Revenue");
  if (num(employees, "Employees") <= 0) throw new Error("Employees must be above zero.");
  if (typeof profit !== "number" || !Number.isFinite(profit)) throw new Error("Profit must be a number.");
  num(payroll, "Payroll");
  return { revenuePerEmployee: round2(revenue / employees), profitPerEmployee: round2(profit / employees), payrollPerEmployee: payroll > 0 ? round2(payroll / employees) : null, revenueToPayroll: payroll > 0 ? round2(revenue / payroll) : null, payrollPercent: payroll > 0 && revenue > 0 ? round2((payroll / revenue) * 100) : null };
}
