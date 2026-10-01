import { describe, it, expect } from "vitest";
import { projectProfit } from "../public/calc.js";
describe("projectProfit", () => {
  it("computes cost, profit, margin, effective rate and break-even hours", () => {
    const r = projectProfit({ price: 10000, hours: 80, costPerHour: 55, expenses: 500 });
    expect(r.laborCost).toBe(4400); expect(r.totalCost).toBe(4900); expect(r.profit).toBe(5100); expect(r.marginPercent).toBe(51);
    expect(r.effectiveRate).toBe(125); expect(r.breakEvenHours).toBe(172.73);
  });
  it("shows a loss when hours overrun", () => {
    const r = projectProfit({ price: 10000, hours: 200, costPerHour: 55, expenses: 500 });
    expect(r.profit).toBe(-1500); expect(r.marginPercent).toBe(-15);
  });
  it("rejects a zero price", () => {
    expect(() => projectProfit({ price: 0, hours: 10, costPerHour: 55, expenses: 0 })).toThrow(/price/i);
  });
  it("rejects zero hours", () => {
    expect(() => projectProfit({ price: 100, hours: 0, costPerHour: 55, expenses: 0 })).toThrow(/hours/i);
  });
});
