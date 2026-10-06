import { describe, it, expect } from "vitest";
import { hourlyToFixedFee } from "../public/calc.js";
describe("hourlyToFixedFee", () => {
  it("turns hours, rate, buffer, commitment discount and overrun into a fixed monthly fee", () => {
    const r = hourlyToFixedFee({ hoursPerMonth: 10, hourlyRate: 80, bufferPercent: 15, commitmentDiscountPercent: 5, overrunPercent: 20 });
    expect(r.baseMonthly).toBe(800); expect(r.withBuffer).toBe(920); expect(r.fixedFee).toBe(874);
    expect(r.annualFee).toBe(10488); expect(r.effectiveHourlyAtOverrun).toBe(72.83);
  });
  it("assumes no buffer, discount or overrun by default", () => {
    const r = hourlyToFixedFee({ hoursPerMonth: 10, hourlyRate: 80 });
    expect(r.withBuffer).toBe(800); expect(r.fixedFee).toBe(800); expect(r.annualFee).toBe(9600); expect(r.effectiveHourlyAtOverrun).toBe(80);
  });
  it("rejects zero hours per month", () => {
    expect(() => hourlyToFixedFee({ hoursPerMonth: 0, hourlyRate: 80 })).toThrow(/hours/i);
  });
  it("rejects a commitment discount above 100", () => {
    expect(() => hourlyToFixedFee({ hoursPerMonth: 10, hourlyRate: 80, commitmentDiscountPercent: 101 })).toThrow(/discount/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => hourlyToFixedFee({ hoursPerMonth: 10, hourlyRate: -80 })).toThrow(/0 or more/);
    expect(() => hourlyToFixedFee({ hoursPerMonth: 10, hourlyRate: 80, overrunPercent: NaN })).toThrow(/0 or more/);
  });
});
