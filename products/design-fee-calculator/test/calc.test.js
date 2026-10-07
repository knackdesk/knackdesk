import { describe, it, expect } from "vitest";
import { designFee } from "../public/calc.js";
describe("designFee", () => {
  it("prices phase hours, site visits and contingency into a design fee", () => {
    const r = designFee({ conceptHours: 20, developmentHours: 30, documentationHours: 25, siteVisits: 6, hoursPerVisit: 2, hourlyRate: 110, contingencyPercent: 10 });
    expect(r.totalHours).toBe(87); expect(r.siteVisitHours).toBe(12); expect(r.baseFee).toBe(9570); expect(r.contingencyAmount).toBe(957); expect(r.designFee).toBe(10527);
  });
  it("assumes no other phases, no site visits and no contingency by default", () => {
    const r = designFee({ conceptHours: 10, hourlyRate: 100 });
    expect(r.totalHours).toBe(10); expect(r.siteVisitHours).toBe(0); expect(r.baseFee).toBe(1000); expect(r.contingencyAmount).toBe(0); expect(r.designFee).toBe(1000);
  });
  it("accepts site visit hours as the only hours", () => {
    const r = designFee({ siteVisits: 3, hoursPerVisit: 1.5, hourlyRate: 80 });
    expect(r.totalHours).toBe(4.5); expect(r.siteVisitHours).toBe(4.5); expect(r.designFee).toBe(360);
  });
  it("rejects a total of 0 hours", () => {
    expect(() => designFee({ hourlyRate: 110 })).toThrow("Enter at least some hours.");
    expect(() => designFee({ siteVisits: 4, hoursPerVisit: 0, hourlyRate: 110 })).toThrow("Enter at least some hours.");
  });
  it("rejects an hourly rate of 0", () => {
    expect(() => designFee({ conceptHours: 10, hourlyRate: 0 })).toThrow("Hourly rate must be more than 0.");
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => designFee({ conceptHours: -1, hourlyRate: 110 })).toThrow(/0 or more/);
    expect(() => designFee({ conceptHours: 10, hourlyRate: NaN })).toThrow(/0 or more/);
    expect(() => designFee({ conceptHours: 10, hourlyRate: 110, contingencyPercent: -5 })).toThrow(/0 or more/);
    expect(() => designFee({})).toThrow(/0 or more/);
  });
});
