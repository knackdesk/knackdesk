import { describe, it, expect } from "vitest";
import { licensingFee } from "../public/calc.js";
describe("licensingFee", () => {
  it("multiplies the base fee by duration, territory, media and exclusivity factors", () => {
    const r = licensingFee({ baseFee: 500, durationFactor: 2, territoryFactor: 1.5, mediaFactor: 1.2, exclusive: true });
    expect(r.fee).toBe(2700); expect(r.uplift).toBe(2200);
  });
  it("leaves out the exclusivity factor for a non-exclusive licence", () => {
    const r = licensingFee({ baseFee: 500, durationFactor: 2, territoryFactor: 1.5, mediaFactor: 1.2, exclusive: false });
    expect(r.fee).toBe(1800); expect(r.uplift).toBe(1300);
  });
  it("returns the base fee when every factor is 1", () => {
    expect(licensingFee({ baseFee: 500 }).fee).toBe(500);
  });
  it("rejects a zero base fee", () => {
    expect(() => licensingFee({ baseFee: 0 })).toThrow(/fee/i);
  });
  it("rejects a factor below 0", () => {
    expect(() => licensingFee({ baseFee: 500, durationFactor: -1 })).toThrow(/0 or more/);
    expect(() => licensingFee({ baseFee: 500, territoryFactor: -0.5 })).toThrow(/0 or more/);
    expect(() => licensingFee({ baseFee: 500, mediaFactor: -2 })).toThrow(/0 or more/);
    expect(() => licensingFee({ baseFee: 500, exclusive: true, exclusivityFactor: -1 })).toThrow(/0 or more/);
  });
});
