import { describe, it, expect } from "vitest";
import { fillRate } from "../public/calc.js";
describe("fillRate", () => {
  it("turns job orders, days, submittals and interviews into fill rate and funnel ratios", () => {
    const r = fillRate({ jobOrdersReceived: 40, jobOrdersFilled: 26, totalDaysToFill: 806, candidatesSubmitted: 130, interviews: 65 });
    expect(r.fillRatePercent).toBe(65); expect(r.unfilledOrders).toBe(14); expect(r.averageDaysToFill).toBe(31);
    expect(r.submittalsPerFill).toBe(5); expect(r.submittalToInterviewPercent).toBe(50); expect(r.interviewToFillPercent).toBe(40);
  });
  it("assumes no days, submittals or interviews by default and returns null ratios that need them", () => {
    const r = fillRate({ jobOrdersReceived: 10, jobOrdersFilled: 3 });
    expect(r.fillRatePercent).toBe(30); expect(r.unfilledOrders).toBe(7); expect(r.averageDaysToFill).toBe(0);
    expect(r.submittalsPerFill).toBe(0); expect(r.submittalToInterviewPercent).toBeNull(); expect(r.interviewToFillPercent).toBeNull();
  });
  it("returns null per-fill figures when nothing was filled", () => {
    const r = fillRate({ jobOrdersReceived: 10, jobOrdersFilled: 0, totalDaysToFill: 0, candidatesSubmitted: 12, interviews: 4 });
    expect(r.fillRatePercent).toBe(0); expect(r.averageDaysToFill).toBeNull(); expect(r.submittalsPerFill).toBeNull();
    expect(r.submittalToInterviewPercent).toBe(33.33); expect(r.interviewToFillPercent).toBe(0);
  });
  it("rejects job orders received of 0", () => {
    expect(() => fillRate({ jobOrdersReceived: 0, jobOrdersFilled: 0 })).toThrow(/more than 0/);
  });
  it("rejects more filled orders than received", () => {
    expect(() => fillRate({ jobOrdersReceived: 10, jobOrdersFilled: 11 })).toThrow(/cannot be more than/);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => fillRate({ jobOrdersReceived: 10, jobOrdersFilled: -1 })).toThrow(/0 or more/);
    expect(() => fillRate({ jobOrdersReceived: 10, jobOrdersFilled: 5, interviews: NaN })).toThrow(/0 or more/);
    expect(() => fillRate({ jobOrdersReceived: 10 })).toThrow(/0 or more/);
  });
});
