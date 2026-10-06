import { describe, it, expect } from "vitest";
import { ticketPrice } from "../public/calc.js";
const base = { fixedCosts: 5000, variableCostPerAttendee: 15, attendees: 200, targetProfit: 2000, feePercent: 5 };
describe("ticketPrice", () => {
  it("finds break-even and target ticket prices after fees", () => {
    const r = ticketPrice(base);
    expect(r.totalCost).toBe(8000); expect(r.breakEvenPrice).toBe(42.11); expect(r.targetPrice).toBe(52.63);
    expect(r.revenueAtTarget).toBeCloseTo(10526, 2);
    expect(r.feesAtTarget).toBeCloseTo(526.3, 2);
  });
  it("equals cost per attendee with no fees or profit", () => {
    const r = ticketPrice({ fixedCosts: 1000, attendees: 100 });
    expect(r.breakEvenPrice).toBe(10); expect(r.targetPrice).toBe(10);
  });
  it("rejects zero attendees", () => {
    expect(() => ticketPrice({ ...base, attendees: 0 })).toThrow(/attendees/i);
  });
  it("rejects a fee of 100 or more", () => {
    expect(() => ticketPrice({ ...base, feePercent: 100 })).toThrow(/fee/i);
  });
});
