import { describe, it, expect } from "vitest";
import { boothRent } from "../public/calc.js";
describe("boothRent", () => {
  it("turns rent, clients, ticket, product cost and weeks into rent share, net income and break-even clients", () => {
    const r = boothRent({ weeklyRent: 300, clientsPerWeek: 25, averageTicket: 65, productCostPercent: 10, weeksPerYear: 50 });
    expect(r.weeklyRevenue).toBe(1625); expect(r.rentPercentOfRevenue).toBe(18.46); expect(r.netPerWeek).toBe(1162.5);
    expect(r.netPerYear).toBe(58125); expect(r.annualRent).toBe(15000); expect(r.breakEvenClientsPerWeek).toBe(6);
  });
  it("assumes no product cost and 52 weeks by default", () => {
    const r = boothRent({ weeklyRent: 200, clientsPerWeek: 10, averageTicket: 50 });
    expect(r.netPerWeek).toBe(300); expect(r.netPerYear).toBe(15600); expect(r.annualRent).toBe(10400); expect(r.breakEvenClientsPerWeek).toBe(4);
  });
  it("returns 0 rent share when there is no revenue and null break-even when the ticket is 0", () => {
    const r = boothRent({ weeklyRent: 300, clientsPerWeek: 0, averageTicket: 0 });
    expect(r.rentPercentOfRevenue).toBe(0); expect(r.breakEvenClientsPerWeek).toBeNull(); expect(r.netPerWeek).toBe(-300);
  });
  it("rejects product cost above 100", () => {
    expect(() => boothRent({ weeklyRent: 300, clientsPerWeek: 25, averageTicket: 65, productCostPercent: 101 })).toThrow(/product cost/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => boothRent({ weeklyRent: -1, clientsPerWeek: 25, averageTicket: 65 })).toThrow(/0 or more/);
    expect(() => boothRent({ weeklyRent: 300, clientsPerWeek: NaN, averageTicket: 65 })).toThrow(/0 or more/);
  });
});
