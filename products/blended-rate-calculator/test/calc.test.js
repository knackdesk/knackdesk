import { describe, it, expect } from "vitest";
import { blendedRate } from "../public/calc.js";
describe("blendedRate", () => {
  it("weights each rate by its hours", () => {
    const r = blendedRate([{ hours: 10, rate: 150 }, { hours: 30, rate: 80 }]);
    expect(r.totalHours).toBe(40); expect(r.totalCost).toBe(3900); expect(r.blended).toBe(97.5);
  });
  it("ignores rows with zero hours", () => {
    expect(blendedRate([{ hours: 0, rate: 500 }, { hours: 20, rate: 60 }]).blended).toBe(60);
  });
  it("rejects when no hours are entered", () => {
    expect(() => blendedRate([{ hours: 0, rate: 100 }])).toThrow(/hours/i);
  });
  it("rejects a negative rate", () => {
    expect(() => blendedRate([{ hours: 5, rate: -1 }])).toThrow(/rate/i);
  });
});
