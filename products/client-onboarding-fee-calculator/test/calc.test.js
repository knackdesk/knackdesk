import { describe, it, expect } from "vitest";
import { clientOnboardingFee } from "../public/calc.js";
describe("clientOnboardingFee", () => {
  it("turns onboarding hours, rate, setup costs, margin and contract into a fee and its share of the contract", () => {
    const r = clientOnboardingFee({ onboardingHours: 16, hourlyRate: 95, setupCosts: 600, marginOnCostsPercent: 20, contractMonths: 24, monthlyFee: 1500 });
    expect(r.labour).toBe(1520); expect(r.costsWithMargin).toBe(720); expect(r.onboardingFee).toBe(2240);
    expect(r.amortisedPerMonth).toBe(93.33); expect(r.contractValue).toBe(38240); expect(r.feeShareOfContractPercent).toBe(5.86);
  });
  it("assumes no setup costs, margin or contract by default", () => {
    const r = clientOnboardingFee({ onboardingHours: 10, hourlyRate: 80 });
    expect(r.labour).toBe(800); expect(r.costsWithMargin).toBe(0); expect(r.onboardingFee).toBe(800);
    expect(r.amortisedPerMonth).toBeNull(); expect(r.contractValue).toBe(800); expect(r.feeShareOfContractPercent).toBe(100);
  });
  it("returns a 0 percent share when the contract value is 0", () => {
    const r = clientOnboardingFee({ onboardingHours: 0, hourlyRate: 80 });
    expect(r.contractValue).toBe(0); expect(r.feeShareOfContractPercent).toBe(0);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => clientOnboardingFee({ onboardingHours: -1, hourlyRate: 80 })).toThrow(/0 or more/);
    expect(() => clientOnboardingFee({ onboardingHours: 10, hourlyRate: 80, marginOnCostsPercent: NaN })).toThrow(/0 or more/);
    expect(() => clientOnboardingFee({ onboardingHours: 10 })).toThrow(/0 or more/);
  });
});
