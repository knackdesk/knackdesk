import { describe, it, expect } from "vitest";
import { projectBudget } from "../public/calc.js";
describe("projectBudget", () => {
  it("adds expenses, contingency and working days", () => {
    const r = projectBudget({ hours: 80, hourlyRate: 90, expenses: 500, contingencyPercent: 15, discountPercent: 0, hoursPerDay: 8 });
    expect(r.laborCost).toBe(7200); expect(r.subtotal).toBe(7700); expect(r.contingency).toBe(1155); expect(r.total).toBe(8855); expect(r.workingDays).toBe(10);
  });
  it("applies a discount to the total", () => {
    expect(projectBudget({ hours: 80, hourlyRate: 90, expenses: 500, contingencyPercent: 15, discountPercent: 10, hoursPerDay: 8 }).total).toBe(7969.5);
  });
  it("rejects a discount of 100 or more", () => {
    expect(() => projectBudget({ hours: 80, hourlyRate: 90, expenses: 0, contingencyPercent: 0, discountPercent: 100, hoursPerDay: 8 })).toThrow(/discount/i);
  });
  it("rejects zero hours per day", () => {
    expect(() => projectBudget({ hours: 80, hourlyRate: 90, expenses: 0, contingencyPercent: 0, discountPercent: 0, hoursPerDay: 0 })).toThrow(/hours per day/i);
  });
});
