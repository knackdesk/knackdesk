import { describe, it, expect } from "vitest";
import { lockUpDays } from "../public/calc.js";
describe("lockUpDays", () => {
  it("turns WIP, receivables and annual fees into WIP days, debtor days, lock-up and locked-up cash", () => {
    const r = lockUpDays({ unbilledWip: 150000, accountsReceivable: 210000, annualFees: 1460000, daysInYear: 365 });
    expect(r.dailyFees).toBe(4000); expect(r.wipDays).toBe(37.5); expect(r.debtorDays).toBe(52.5);
    expect(r.lockUpDays).toBe(90); expect(r.lockedUpCash).toBe(360000); expect(r.cashPerDayOfLockUp).toBe(4000);
  });
  it("uses a 365-day year by default", () => {
    const r = lockUpDays({ unbilledWip: 4000, accountsReceivable: 8000, annualFees: 1460000 });
    expect(r.dailyFees).toBe(4000); expect(r.wipDays).toBe(1); expect(r.debtorDays).toBe(2); expect(r.lockUpDays).toBe(3);
  });
  it("accepts a different number of days, such as working days", () => {
    const r = lockUpDays({ unbilledWip: 50000, accountsReceivable: 50000, annualFees: 1250000, daysInYear: 250 });
    expect(r.dailyFees).toBe(5000); expect(r.wipDays).toBe(10); expect(r.debtorDays).toBe(10); expect(r.lockUpDays).toBe(20);
  });
  it("returns 0 lock-up when nothing is unbilled or unpaid", () => {
    const r = lockUpDays({ unbilledWip: 0, accountsReceivable: 0, annualFees: 1000000 });
    expect(r.lockUpDays).toBe(0); expect(r.lockedUpCash).toBe(0);
  });
  it("rejects annual fees of 0 and days in year of 0", () => {
    expect(() => lockUpDays({ unbilledWip: 1, accountsReceivable: 1, annualFees: 0 })).toThrow(/Annual fees must be more than 0/);
    expect(() => lockUpDays({ unbilledWip: 1, accountsReceivable: 1, annualFees: 1000, daysInYear: 0 })).toThrow(/Days in year must be more than 0/);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => lockUpDays({ unbilledWip: -1, accountsReceivable: 1, annualFees: 1000 })).toThrow(/0 or more/);
    expect(() => lockUpDays({ unbilledWip: 1, accountsReceivable: NaN, annualFees: 1000 })).toThrow(/0 or more/);
    expect(() => lockUpDays({ unbilledWip: 1, accountsReceivable: 1 })).toThrow(/0 or more/);
  });
});
