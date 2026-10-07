import { describe, it, expect } from "vitest";
import { timekeeperCostRate } from "../public/calc.js";
describe("timekeeperCostRate", () => {
  it("turns salary, benefits, overhead, billable hours and bill rate into a cost rate, margin and break-even hours", () => {
    const r = timekeeperCostRate({ annualSalary: 90000, benefitsPercent: 20, overheadAllocationAnnual: 60000, billableHoursPerYear: 1500, billRate: 250 });
    expect(r.loadedSalary).toBe(108000); expect(r.totalAnnualCost).toBe(168000); expect(r.costRate).toBe(112);
    expect(r.marginPerHour).toBe(138); expect(r.marginPercent).toBe(55.2); expect(r.breakEvenHours).toBe(672);
  });
  it("assumes no benefits, overhead or bill rate by default and returns null break-even hours", () => {
    const r = timekeeperCostRate({ annualSalary: 60000, billableHoursPerYear: 1200 });
    expect(r.loadedSalary).toBe(60000); expect(r.totalAnnualCost).toBe(60000); expect(r.costRate).toBe(50);
    expect(r.marginPerHour).toBe(-50); expect(r.marginPercent).toBe(0); expect(r.breakEvenHours).toBeNull();
  });
  it("returns a negative margin when the bill rate is below the cost rate", () => {
    const r = timekeeperCostRate({ annualSalary: 90000, benefitsPercent: 20, overheadAllocationAnnual: 60000, billableHoursPerYear: 1500, billRate: 100 });
    expect(r.marginPerHour).toBe(-12); expect(r.marginPercent).toBe(-12); expect(r.breakEvenHours).toBe(1680);
  });
  it("rejects billable hours of 0", () => {
    expect(() => timekeeperCostRate({ annualSalary: 90000, billableHoursPerYear: 0 })).toThrow(/Billable hours per year must be more than 0/);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => timekeeperCostRate({ annualSalary: -1, billableHoursPerYear: 1500 })).toThrow(/0 or more/);
    expect(() => timekeeperCostRate({ annualSalary: 90000, benefitsPercent: NaN, billableHoursPerYear: 1500 })).toThrow(/0 or more/);
    expect(() => timekeeperCostRate({ billableHoursPerYear: 1500 })).toThrow(/0 or more/);
    expect(() => timekeeperCostRate({ annualSalary: 90000, overheadAllocationAnnual: -5, billableHoursPerYear: 1500 })).toThrow(/0 or more/);
    expect(() => timekeeperCostRate({ annualSalary: 90000, billableHoursPerYear: 1500, billRate: "250" })).toThrow(/0 or more/);
  });
});
