import { describe, it, expect } from "vitest";
import { changeOrder } from "../public/calc.js";
describe("changeOrder", () => {
  it("prices the change with markups and revises the contract total", () => {
    const r = changeOrder({ originalContract: 20000, previousChangeOrders: 1500, materials: 800, laborHours: 10, hourlyRate: 50, subcontractors: 1000, markupPercent: 35, subMarkupPercent: 10 });
    expect(r.ownCost).toBe(1300); expect(r.ownMarkup).toBe(455); expect(r.subMarkup).toBe(100); expect(r.changePrice).toBe(2855);
    expect(r.revisedTotal).toBe(24355); expect(r.changePercent).toBe(14.28); expect(r.cumulativePercent).toBe(21.78);
  });
  it("handles a change with no subcontractor work", () => {
    expect(changeOrder({ originalContract: 10000, previousChangeOrders: 0, materials: 100, laborHours: 2, hourlyRate: 50, subcontractors: 0, markupPercent: 50, subMarkupPercent: 10 }).changePrice).toBe(300);
  });
  it("rejects a zero original contract", () => {
    expect(() => changeOrder({ originalContract: 0, previousChangeOrders: 0, materials: 100, laborHours: 0, hourlyRate: 0, subcontractors: 0, markupPercent: 0, subMarkupPercent: 0 })).toThrow(/contract/i);
  });
});
