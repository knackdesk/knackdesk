import { describe, it, expect } from "vitest";
import { effectiveRate } from "../public/calc.js";

describe("effective hourly rate", () => {
  it("divides fee minus expenses by hours and compares with target", () => {
    const r = effectiveRate({ fee: 3000, expenses: 200, hours: 40, targetRate: 80 });
    expect(r.net).toBe(2800);
    expect(r.hourly).toBe(70);
    expect(r.vsTargetPercent).toBe(-12.5);
    expect(r.hoursAtTarget).toBe(35);
  });
  it("works without a target", () => {
    const r = effectiveRate({ fee: 1000, expenses: 0, hours: 10 });
    expect(r.hourly).toBe(100);
    expect(r.vsTargetPercent).toBeNull();
  });
  it("rejects zero hours and expenses above fee", () => {
    expect(() => effectiveRate({ fee: 100, expenses: 0, hours: 0 })).toThrow(/hours/i);
    expect(() => effectiveRate({ fee: 100, expenses: 150, hours: 1 })).toThrow(/expenses/i);
  });
});
