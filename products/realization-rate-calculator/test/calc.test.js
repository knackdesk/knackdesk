import { describe, it, expect } from "vitest";
import { realizationRate } from "../public/calc.js";
describe("realizationRate", () => {
  it("turns hours, standard rate, billed and collected amounts into billing, collection and overall realization", () => {
    const r = realizationRate({ hoursWorked: 120, standardRate: 150, amountBilled: 15300, amountCollected: 14535 });
    expect(r.standardFees).toBe(18000); expect(r.billingRealizationPercent).toBe(85); expect(r.collectionRealizationPercent).toBe(95);
    expect(r.overallRealizationPercent).toBe(80.75); expect(r.writeOffs).toBe(2700); expect(r.uncollected).toBe(765); expect(r.effectiveRate).toBe(121.13);
  });
  it("returns 0 collection realization when nothing was billed", () => {
    const r = realizationRate({ hoursWorked: 10, standardRate: 100, amountBilled: 0, amountCollected: 0 });
    expect(r.collectionRealizationPercent).toBe(0); expect(r.writeOffs).toBe(1000); expect(r.effectiveRate).toBe(0);
  });
  it("shows billing above standard as a negative write-off", () => {
    const r = realizationRate({ hoursWorked: 10, standardRate: 100, amountBilled: 1200, amountCollected: 1200 });
    expect(r.billingRealizationPercent).toBe(120); expect(r.writeOffs).toBe(-200);
  });
  it("rejects zero hours worked", () => {
    expect(() => realizationRate({ hoursWorked: 0, standardRate: 150, amountBilled: 100, amountCollected: 100 })).toThrow(/hours/i);
  });
  it("rejects a zero standard rate", () => {
    expect(() => realizationRate({ hoursWorked: 10, standardRate: 0, amountBilled: 100, amountCollected: 100 })).toThrow(/standard rate/i);
  });
  it("rejects collecting more than was billed", () => {
    expect(() => realizationRate({ hoursWorked: 120, standardRate: 150, amountBilled: 1000, amountCollected: 1001 })).toThrow(/collected.*billed/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => realizationRate({ hoursWorked: 120, standardRate: 150, amountBilled: -1, amountCollected: 0 })).toThrow(/0 or more/);
    expect(() => realizationRate({ hoursWorked: 120, standardRate: 150, amountBilled: 100, amountCollected: undefined })).toThrow(/0 or more/);
  });
});
