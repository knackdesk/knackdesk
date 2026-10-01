import { describe, it, expect } from "vitest";
import { revenuePerEmployee } from "../public/calc.js";
describe("revenuePerEmployee", () => {
  it("divides revenue and profit by headcount and compares revenue to payroll", () => {
    const r = revenuePerEmployee({ revenue: 1200000, employees: 15, profit: 180000, payroll: 600000 });
    expect(r.revenuePerEmployee).toBe(80000); expect(r.profitPerEmployee).toBe(12000); expect(r.revenueToPayroll).toBe(2); expect(r.payrollPercent).toBe(50);
  });
  it("returns null ratios when payroll is not given", () => {
    const r = revenuePerEmployee({ revenue: 100000, employees: 2, profit: 0, payroll: 0 });
    expect(r.revenueToPayroll).toBeNull(); expect(r.payrollPercent).toBeNull();
  });
  it("rejects zero employees", () => {
    expect(() => revenuePerEmployee({ revenue: 100000, employees: 0, profit: 0, payroll: 0 })).toThrow(/employees/i);
  });
});
