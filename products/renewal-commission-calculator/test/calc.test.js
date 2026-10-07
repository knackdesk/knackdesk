import { describe, it, expect } from "vitest";
import { renewalCommission } from "../public/calc.js";
describe("renewalCommission", () => {
  it("turns policies, premium, commission rates, retention and years into book, first-year renewal and residual commission", () => {
    const r = renewalCommission({ policies: 400, averagePremium: 1200, renewalCommissionPercent: 10, retentionPercent: 88, years: 3, newBusinessCommissionPercent: 15 });
    expect(r.annualBookCommission).toBe(48000); expect(r.newBusinessCommission).toBe(72000); expect(r.firstYearRenewal).toBe(42240);
    expect(r.residualsOverYears).toBe(112121.86); expect(r.policiesRemainingAfterYears).toBe(272.59);
  });
  it("assumes full retention, one year and no new business commission by default", () => {
    const r = renewalCommission({ policies: 100, averagePremium: 1000, renewalCommissionPercent: 10 });
    expect(r.annualBookCommission).toBe(10000); expect(r.newBusinessCommission).toBe(0); expect(r.firstYearRenewal).toBe(10000);
    expect(r.residualsOverYears).toBe(10000); expect(r.policiesRemainingAfterYears).toBe(100);
  });
  it("compounds retention year on year", () => {
    const r = renewalCommission({ policies: 100, averagePremium: 100, renewalCommissionPercent: 10, retentionPercent: 50, years: 2 });
    expect(r.firstYearRenewal).toBe(500); expect(r.residualsOverYears).toBe(750); expect(r.policiesRemainingAfterYears).toBe(25);
  });
  it("gives zero residuals when retention is 0", () => {
    const r = renewalCommission({ policies: 10, averagePremium: 500, renewalCommissionPercent: 10, retentionPercent: 0, years: 5 });
    expect(r.firstYearRenewal).toBe(0); expect(r.residualsOverYears).toBe(0); expect(r.policiesRemainingAfterYears).toBe(0);
  });
  it("rejects policies of 0", () => {
    expect(() => renewalCommission({ policies: 0, averagePremium: 1000, renewalCommissionPercent: 10 })).toThrow(/Policies must be more than 0/);
  });
  it("rejects any percentage above 100", () => {
    expect(() => renewalCommission({ policies: 10, averagePremium: 1000, renewalCommissionPercent: 101 })).toThrow(/Renewal commission percentage must be between 0 and 100/);
    expect(() => renewalCommission({ policies: 10, averagePremium: 1000, renewalCommissionPercent: 10, retentionPercent: 100.5 })).toThrow(/Retention percentage must be between 0 and 100/);
    expect(() => renewalCommission({ policies: 10, averagePremium: 1000, renewalCommissionPercent: 10, newBusinessCommissionPercent: 120 })).toThrow(/New business commission percentage must be between 0 and 100/);
  });
  it("rejects years below 1 or not a whole number", () => {
    expect(() => renewalCommission({ policies: 10, averagePremium: 1000, renewalCommissionPercent: 10, years: 0 })).toThrow(/Years must be a whole number of 1 or more/);
    expect(() => renewalCommission({ policies: 10, averagePremium: 1000, renewalCommissionPercent: 10, years: 2.5 })).toThrow(/Years must be a whole number of 1 or more/);
  });
  it("rejects negative, non-numeric or missing input", () => {
    expect(() => renewalCommission({ policies: -1, averagePremium: 1000, renewalCommissionPercent: 10 })).toThrow(/0 or more/);
    expect(() => renewalCommission({ policies: 10, averagePremium: NaN, renewalCommissionPercent: 10 })).toThrow(/Average premium/);
    expect(() => renewalCommission({ policies: 10, averagePremium: 1000 })).toThrow(/Renewal commission percentage/);
  });
});
