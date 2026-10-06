import { describe, it, expect } from "vitest";
import { laborCostPercent } from "../public/calc.js";
describe("laborCostPercent", () => {
  it("compares scheduled labour cost with projected sales and a target", () => {
    const r = laborCostPercent({ scheduledHours: 400, averageWage: 15, payrollTaxPercent: 12, projectedSales: 25000, targetPercent: 25 });
    expect(r.laborCost).toBe(6720); expect(r.laborPercent).toBe(26.88); expect(r.allowedLaborCost).toBe(6250);
    expect(r.hoursAllowed).toBe(372.02); expect(r.hoursOver).toBe(27.98);
  });
  it("reports no hours over when the schedule is within the target", () => {
    const r = laborCostPercent({ scheduledHours: 100, averageWage: 10, projectedSales: 10000, targetPercent: 20 });
    expect(r.laborCost).toBe(1000); expect(r.laborPercent).toBe(10); expect(r.hoursAllowed).toBe(200); expect(r.hoursOver).toBe(0);
  });
  it("rejects zero projected sales", () => {
    expect(() => laborCostPercent({ scheduledHours: 400, averageWage: 15, projectedSales: 0 })).toThrow(/sales/i);
  });
  it("rejects a zero wage", () => {
    expect(() => laborCostPercent({ scheduledHours: 400, averageWage: 0, projectedSales: 25000 })).toThrow(/wage/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => laborCostPercent({ scheduledHours: -1, averageWage: 15, projectedSales: 25000 })).toThrow(/0 or more/);
    expect(() => laborCostPercent({ scheduledHours: 400, averageWage: 15, payrollTaxPercent: NaN, projectedSales: 25000 })).toThrow(/0 or more/);
  });
});
