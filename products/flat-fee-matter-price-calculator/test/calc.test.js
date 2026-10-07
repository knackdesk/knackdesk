import { describe, it, expect } from "vitest";
import { flatFeeMatterPrice } from "../public/calc.js";
describe("flatFeeMatterPrice", () => {
  it("turns hours, cost rates, disbursements, contingency and margin into a flat fee and effective hourly rate", () => {
    const r = flatFeeMatterPrice({ partnerHours: 4, partnerCostRate: 180, associateHours: 12, associateCostRate: 110, paralegalHours: 6, paralegalCostRate: 55, disbursements: 300, contingencyPercent: 15, marginPercent: 35 });
    expect(r.labourCost).toBe(2370); expect(r.costWithContingency).toBe(2725.5); expect(r.totalCost).toBe(3025.5);
    expect(r.flatFee).toBe(4654.62); expect(r.totalHours).toBe(22); expect(r.effectiveHourlyRate).toBe(211.57);
  });
  it("defaults every input to 0 and returns a null effective rate when there are no hours", () => {
    const r = flatFeeMatterPrice({});
    expect(r.labourCost).toBe(0); expect(r.totalCost).toBe(0); expect(r.flatFee).toBe(0);
    expect(r.totalHours).toBe(0); expect(r.effectiveHourlyRate).toBeNull();
  });
  it("prices at cost when contingency and margin are 0", () => {
    const r = flatFeeMatterPrice({ associateHours: 10, associateCostRate: 100, disbursements: 50 });
    expect(r.costWithContingency).toBe(1000); expect(r.totalCost).toBe(1050); expect(r.flatFee).toBe(1050); expect(r.effectiveHourlyRate).toBe(105);
  });
  it("rejects a margin of 100 percent or more", () => {
    expect(() => flatFeeMatterPrice({ associateHours: 10, associateCostRate: 100, marginPercent: 100 })).toThrow(/less than 100/);
    expect(() => flatFeeMatterPrice({ associateHours: 10, associateCostRate: 100, marginPercent: 120 })).toThrow(/less than 100/);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => flatFeeMatterPrice({ partnerHours: -1 })).toThrow(/0 or more/);
    expect(() => flatFeeMatterPrice({ associateCostRate: NaN })).toThrow(/0 or more/);
    expect(() => flatFeeMatterPrice({ disbursements: "300" })).toThrow(/0 or more/);
    expect(() => flatFeeMatterPrice({ contingencyPercent: -5 })).toThrow(/0 or more/);
  });
});
