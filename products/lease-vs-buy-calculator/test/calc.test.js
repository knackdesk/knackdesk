import { describe, it, expect } from "vitest";
import { leaseVsBuy } from "../public/calc.js";
const base = { price: 30000, deposit: 0, loanRatePercent: 6, loanMonths: 60, resaleValue: 9000, leaseMonthly: 550, leaseMonths: 60, leaseBuyout: 3000 };
describe("leaseVsBuy", () => {
  it("totals both options over the term and names the cheaper one", () => {
    const r = leaseVsBuy(base);
    expect(r.loanPayment).toBe(579.98); expect(r.buyTotal).toBe(25798.8); expect(r.leaseTotal).toBe(27000); expect(r.cheaper).toBe("buy"); expect(r.difference).toBe(1201.2);
  });
  it("does not credit resale to a lease with no buyout", () => {
    const r = leaseVsBuy({ ...base, leaseBuyout: 0 });
    expect(r.leaseTotal).toBe(33000);
  });
  it("rejects a zero price", () => {
    expect(() => leaseVsBuy({ ...base, price: 0 })).toThrow(/price/i);
  });
});
