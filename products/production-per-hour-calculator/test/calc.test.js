import { describe, it, expect } from "vitest";
import { productionPerHour } from "../public/calc.js";
describe("productionPerHour", () => {
  it("turns gross production, adjustments, hours and days into net production, production per hour and per day and profit per hour", () => {
    const r = productionPerHour({ grossProduction: 48000, adjustments: 6000, hoursWorked: 120, daysWorked: 15, overheadPerHour: 210 });
    expect(r.netProduction).toBe(42000); expect(r.productionPerHour).toBe(350); expect(r.productionPerDay).toBe(2800); expect(r.profitPerHour).toBe(140);
  });
  it("assumes no adjustments, days or overhead by default and returns a null daily figure", () => {
    const r = productionPerHour({ grossProduction: 9000, hoursWorked: 30 });
    expect(r.netProduction).toBe(9000); expect(r.productionPerHour).toBe(300); expect(r.productionPerDay).toBeNull(); expect(r.profitPerHour).toBe(300);
  });
  it("returns a negative profit per hour when overhead per hour exceeds production per hour", () => {
    expect(productionPerHour({ grossProduction: 10000, hoursWorked: 50, overheadPerHour: 250 }).profitPerHour).toBe(-50);
  });
  it("rounds to two decimals", () => {
    expect(productionPerHour({ grossProduction: 1000, hoursWorked: 3, daysWorked: 3 }).productionPerHour).toBe(333.33);
  });
  it("rejects hours worked of 0", () => {
    expect(() => productionPerHour({ grossProduction: 1000, hoursWorked: 0 })).toThrow(/Hours worked must be more than 0/);
  });
  it("rejects adjustments greater than gross production", () => {
    expect(() => productionPerHour({ grossProduction: 1000, adjustments: 1001, hoursWorked: 10 })).toThrow(/Adjustments cannot exceed gross production/);
  });
  it("rejects negative, non-numeric or missing input", () => {
    expect(() => productionPerHour({ grossProduction: -1, hoursWorked: 10 })).toThrow(/0 or more/);
    expect(() => productionPerHour({ grossProduction: 1000, hoursWorked: 10, daysWorked: NaN })).toThrow(/Days worked/);
    expect(() => productionPerHour({ grossProduction: 1000 })).toThrow(/Hours worked/);
  });
});
