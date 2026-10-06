import { describe, it, expect } from "vitest";
import { hygieneDepartmentProfit } from "../public/calc.js";
describe("hygieneDepartmentProfit", () => {
  it("turns hygiene production, wages, payroll tax, supplies, hours and overhead into profit, margin and hourly figures", () => {
    const r = hygieneDepartmentProfit({ hygieneProduction: 22000, hygienistWages: 8000, payrollTaxPercent: 15, suppliesCost: 1200, hygienistHours: 130, overheadAllocation: 4000 });
    expect(r.loadedWages).toBe(9200); expect(r.totalCost).toBe(14400); expect(r.departmentProfit).toBe(7600); expect(r.marginPercent).toBe(34.55);
    expect(r.productionPerHour).toBe(169.23); expect(r.costPerHour).toBe(110.77);
  });
  it("assumes no payroll tax, supplies or overhead allocation by default", () => {
    const r = hygieneDepartmentProfit({ hygieneProduction: 10000, hygienistWages: 4000, hygienistHours: 100 });
    expect(r.loadedWages).toBe(4000); expect(r.totalCost).toBe(4000); expect(r.departmentProfit).toBe(6000); expect(r.marginPercent).toBe(60);
    expect(r.productionPerHour).toBe(100); expect(r.costPerHour).toBe(40);
  });
  it("returns a negative profit when costs exceed production", () => {
    const r = hygieneDepartmentProfit({ hygieneProduction: 10000, hygienistWages: 9000, payrollTaxPercent: 10, hygienistHours: 100, overheadAllocation: 2000 });
    expect(r.departmentProfit).toBe(-1900); expect(r.marginPercent).toBe(-19);
  });
  it("returns a margin of 0 when production is 0", () => {
    expect(hygieneDepartmentProfit({ hygieneProduction: 0, hygienistWages: 1000, hygienistHours: 10 }).marginPercent).toBe(0);
  });
  it("rejects hygienist hours of 0", () => {
    expect(() => hygieneDepartmentProfit({ hygieneProduction: 1000, hygienistWages: 500, hygienistHours: 0 })).toThrow(/Hygienist hours must be more than 0/);
  });
  it("rejects a payroll tax percentage above 100", () => {
    expect(() => hygieneDepartmentProfit({ hygieneProduction: 1000, hygienistWages: 500, payrollTaxPercent: 101, hygienistHours: 10 })).toThrow(/between 0 and 100/);
  });
  it("rejects negative, non-numeric or missing input", () => {
    expect(() => hygieneDepartmentProfit({ hygieneProduction: -1, hygienistWages: 500, hygienistHours: 10 })).toThrow(/0 or more/);
    expect(() => hygieneDepartmentProfit({ hygieneProduction: 1000, hygienistWages: 500, suppliesCost: NaN, hygienistHours: 10 })).toThrow(/Supplies cost/);
    expect(() => hygieneDepartmentProfit({ hygieneProduction: 1000, hygienistHours: 10 })).toThrow(/Hygienist wages/);
  });
});
