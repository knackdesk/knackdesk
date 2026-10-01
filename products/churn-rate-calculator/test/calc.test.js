import { describe, it, expect } from "vitest";
import { churn } from "../public/calc.js";

describe("churn", () => {
  it("computes customer and revenue churn, retention and annualised churn", () => {
    const r = churn({ startCustomers: 500, lostCustomers: 15, startMrr: 20000, lostMrr: 500 });
    expect(r.customerChurn).toBe(3);
    expect(r.customerRetention).toBe(97);
    expect(r.revenueChurn).toBe(2.5);
    expect(r.annualisedCustomerChurn).toBe(30.62);
  });
  it("works without revenue figures", () => {
    const r = churn({ startCustomers: 200, lostCustomers: 10 });
    expect(r.customerChurn).toBe(5);
    expect(r.revenueChurn).toBeNull();
  });
  it("rejects lost above start and zero start", () => {
    expect(() => churn({ startCustomers: 0, lostCustomers: 0 })).toThrow(/start/i);
    expect(() => churn({ startCustomers: 10, lostCustomers: 11 })).toThrow(/lost/i);
  });
});
