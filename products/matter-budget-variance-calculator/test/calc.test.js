import { describe, it, expect } from "vitest";
import { matterBudgetVariance } from "../public/calc.js";
describe("matterBudgetVariance", () => {
  it("turns budget, actuals and the agreed fee into variances, realized rate, write-off and recovery", () => {
    const r = matterBudgetVariance({ budgetHours: 40, budgetFees: 9000, actualHours: 52, actualFees: 11700, agreedFee: 10000 });
    expect(r.hoursVariance).toBe(12); expect(r.hoursVariancePercent).toBe(30); expect(r.feesVariance).toBe(2700); expect(r.feesVariancePercent).toBe(30);
    expect(r.realizedRate).toBe(225); expect(r.writeOff).toBe(1700); expect(r.recoveryPercent).toBe(85.47);
  });
  it("returns null write-off and recovery when no agreed fee is entered", () => {
    const r = matterBudgetVariance({ budgetHours: 40, budgetFees: 9000, actualHours: 52, actualFees: 11700 });
    expect(r.writeOff).toBeNull(); expect(r.recoveryPercent).toBeNull();
    const z = matterBudgetVariance({ budgetHours: 40, budgetFees: 9000, actualHours: 52, actualFees: 11700, agreedFee: 0 });
    expect(z.writeOff).toBeNull(); expect(z.recoveryPercent).toBeNull();
  });
  it("returns a negative variance when the matter came in under budget, and no write-off when the agreed fee covers the work", () => {
    const r = matterBudgetVariance({ budgetHours: 40, budgetFees: 9000, actualHours: 30, actualFees: 6750, agreedFee: 9000 });
    expect(r.hoursVariance).toBe(-10); expect(r.hoursVariancePercent).toBe(-25); expect(r.feesVariance).toBe(-2250); expect(r.feesVariancePercent).toBe(-25);
    expect(r.writeOff).toBe(0); expect(r.recoveryPercent).toBe(133.33);
  });
  it("returns 0 variance percent when the budget is 0 and null realized rate and recovery when there are no actuals", () => {
    const r = matterBudgetVariance({ budgetHours: 0, budgetFees: 0, actualHours: 0, actualFees: 0, agreedFee: 500 });
    expect(r.hoursVariancePercent).toBe(0); expect(r.feesVariancePercent).toBe(0);
    expect(r.realizedRate).toBeNull(); expect(r.writeOff).toBe(0); expect(r.recoveryPercent).toBeNull();
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => matterBudgetVariance({ budgetHours: -1, budgetFees: 9000, actualHours: 52, actualFees: 11700 })).toThrow(/0 or more/);
    expect(() => matterBudgetVariance({ budgetHours: 40, budgetFees: NaN, actualHours: 52, actualFees: 11700 })).toThrow(/0 or more/);
    expect(() => matterBudgetVariance({ budgetHours: 40, budgetFees: 9000, actualFees: 11700 })).toThrow(/0 or more/);
    expect(() => matterBudgetVariance({ budgetHours: 40, budgetFees: 9000, actualHours: 52, actualFees: 11700, agreedFee: -10 })).toThrow(/0 or more/);
  });
});
