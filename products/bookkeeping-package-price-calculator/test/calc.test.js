import { describe, it, expect } from "vitest";
import { bookkeepingPackagePrice } from "../public/calc.js";
describe("bookkeepingPackagePrice", () => {
  it("adds base fee, transaction charge, account charge and add-ons into a monthly and annual fee", () => {
    const r = bookkeepingPackagePrice({ baseFee: 250, transactionsPerMonth: 150, perTransactionRate: 1.5, bankAccounts: 3, perAccountFee: 25, addOns: 100, estimatedHours: 8 });
    expect(r.transactionCharge).toBe(225); expect(r.accountCharge).toBe(75); expect(r.monthlyFee).toBe(650);
    expect(r.annualFee).toBe(7800); expect(r.effectiveHourlyRate).toBe(81.25);
  });
  it("uses only the base fee by default and returns no hourly rate without hours", () => {
    const r = bookkeepingPackagePrice({ baseFee: 300 });
    expect(r.transactionCharge).toBe(0); expect(r.accountCharge).toBe(0); expect(r.monthlyFee).toBe(300);
    expect(r.annualFee).toBe(3600); expect(r.effectiveHourlyRate).toBeNull();
  });
  it("returns a null effective hourly rate when hours is 0", () => {
    const r = bookkeepingPackagePrice({ baseFee: 250, transactionsPerMonth: 150, perTransactionRate: 1.5, estimatedHours: 0 });
    expect(r.effectiveHourlyRate).toBeNull();
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => bookkeepingPackagePrice({ baseFee: -1 })).toThrow(/0 or more/);
    expect(() => bookkeepingPackagePrice({ baseFee: 250, transactionsPerMonth: NaN })).toThrow(/0 or more/);
    expect(() => bookkeepingPackagePrice({ baseFee: 250, estimatedHours: -2 })).toThrow(/hours/i);
  });
  it("rejects a missing base fee", () => {
    expect(() => bookkeepingPackagePrice({})).toThrow(/base fee/i);
  });
});
