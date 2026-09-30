import { describe, it, expect } from "vitest";
import { lateFee } from "../public/calc.js";

describe("late fee", () => {
  it("flat fee is charged once regardless of days late", () => {
    const r = lateFee({ amount: 1000, daysLate: 17, type: "flat", flatFee: 25 });
    expect(r.fee).toBe(25);
    expect(r.total).toBe(1025);
  });
  it("monthly percentage is prorated by day over a 30-day month", () => {
    // 1.5% per month on 1000 = 15/month; 15 days late = 7.5
    const r = lateFee({ amount: 1000, daysLate: 15, type: "monthly", ratePercent: 1.5 });
    expect(r.fee).toBe(7.5);
    expect(r.total).toBe(1007.5);
  });
  it("annual percentage is prorated by day over 365 days", () => {
    // 8% APR on 2000 for 73 days = 2000*0.08*73/365 = 32
    const r = lateFee({ amount: 2000, daysLate: 73, type: "annual", ratePercent: 8 });
    expect(r.fee).toBe(32);
  });
  it("rounds to cents", () => {
    const r = lateFee({ amount: 333.33, daysLate: 10, type: "monthly", ratePercent: 2 });
    expect(r.fee).toBe(2.22);
  });
  it("zero days late means zero fee", () => {
    expect(lateFee({ amount: 500, daysLate: 0, type: "monthly", ratePercent: 5 }).fee).toBe(0);
  });
  it("rejects negative or non-numeric inputs", () => {
    expect(() => lateFee({ amount: -1, daysLate: 1, type: "flat", flatFee: 1 })).toThrow(/amount/i);
    expect(() => lateFee({ amount: 100, daysLate: -1, type: "flat", flatFee: 1 })).toThrow(/days/i);
    expect(() => lateFee({ amount: 100, daysLate: 1, type: "monthly", ratePercent: "x" })).toThrow(/rate/i);
  });
});
