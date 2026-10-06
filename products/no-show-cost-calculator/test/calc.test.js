import { describe, it, expect } from "vitest";
import { noShowCost } from "../public/calc.js";
describe("noShowCost", () => {
  it("turns appointments, no-show rate, ticket, weeks and fee into lost and recovered revenue", () => {
    const r = noShowCost({ appointmentsPerWeek: 40, noShowPercent: 8, averageTicket: 65, weeksPerYear: 50, feePerNoShow: 25 });
    expect(r.noShowsPerWeek).toBe(3.2); expect(r.lostPerWeek).toBe(208); expect(r.lostPerYear).toBe(10400);
    expect(r.feeRecoveredPerYear).toBe(4000); expect(r.netLostPerYear).toBe(6400);
  });
  it("assumes 52 weeks and no fee by default", () => {
    const r = noShowCost({ appointmentsPerWeek: 20, noShowPercent: 10, averageTicket: 50 });
    expect(r.lostPerYear).toBe(5200); expect(r.feeRecoveredPerYear).toBe(0); expect(r.netLostPerYear).toBe(5200);
  });
  it("rejects a no-show percentage above 100", () => {
    expect(() => noShowCost({ appointmentsPerWeek: 40, noShowPercent: 101, averageTicket: 65 })).toThrow(/no-show/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => noShowCost({ appointmentsPerWeek: -1, noShowPercent: 8, averageTicket: 65 })).toThrow(/0 or more/);
    expect(() => noShowCost({ appointmentsPerWeek: 40, noShowPercent: 8, averageTicket: NaN })).toThrow(/0 or more/);
  });
});
