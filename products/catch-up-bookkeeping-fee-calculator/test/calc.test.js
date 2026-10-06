import { describe, it, expect } from "vitest";
import { catchUpBookkeepingFee } from "../public/calc.js";
describe("catchUpBookkeepingFee", () => {
  it("turns months behind, hours per month, rate, setup fee and discount into a total quote", () => {
    const r = catchUpBookkeepingFee({ monthsBehind: 9, hoursPerMonth: 4, hourlyRate: 75, setupFee: 200, discountPercent: 10 });
    expect(r.totalHours).toBe(36); expect(r.labourCost).toBe(2700); expect(r.subtotal).toBe(2900);
    expect(r.discount).toBe(290); expect(r.total).toBe(2610); expect(r.perMonth).toBe(290);
  });
  it("assumes no setup fee and no discount by default", () => {
    const r = catchUpBookkeepingFee({ monthsBehind: 3, hoursPerMonth: 5, hourlyRate: 60 });
    expect(r.subtotal).toBe(900); expect(r.discount).toBe(0); expect(r.total).toBe(900); expect(r.perMonth).toBe(300);
  });
  it("rejects zero months behind", () => {
    expect(() => catchUpBookkeepingFee({ monthsBehind: 0, hoursPerMonth: 4, hourlyRate: 75 })).toThrow(/months/i);
  });
  it("rejects a discount above 100", () => {
    expect(() => catchUpBookkeepingFee({ monthsBehind: 9, hoursPerMonth: 4, hourlyRate: 75, discountPercent: 101 })).toThrow(/discount/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => catchUpBookkeepingFee({ monthsBehind: 9, hoursPerMonth: -1, hourlyRate: 75 })).toThrow(/0 or more/);
    expect(() => catchUpBookkeepingFee({ monthsBehind: 9, hoursPerMonth: 4, hourlyRate: NaN })).toThrow(/0 or more/);
  });
});
