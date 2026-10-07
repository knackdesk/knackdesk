import { describe, it, expect } from "vitest";
import { agentCommissionSplit } from "../public/calc.js";
describe("agentCommissionSplit", () => {
  it("turns premium, carrier commission, agent split, policies and agency fee into each side's share and the agent's net", () => {
    const r = agentCommissionSplit({ premium: 1500, carrierCommissionPercent: 12, agentSplitPercent: 60, policies: 25, agencyFeePerPolicy: 10 });
    expect(r.grossCommission).toBe(4500); expect(r.agentShare).toBe(2700); expect(r.agencyShare).toBe(1800);
    expect(r.agencyFees).toBe(250); expect(r.agentNet).toBe(2450); expect(r.agentEffectivePercentOfPremium).toBe(6.53);
  });
  it("assumes one policy and no agency fee by default", () => {
    const r = agentCommissionSplit({ premium: 1000, carrierCommissionPercent: 10, agentSplitPercent: 50 });
    expect(r.grossCommission).toBe(100); expect(r.agentShare).toBe(50); expect(r.agencyShare).toBe(50);
    expect(r.agencyFees).toBe(0); expect(r.agentNet).toBe(50); expect(r.agentEffectivePercentOfPremium).toBe(5);
  });
  it("returns a negative agent net when fees exceed the agent's share", () => {
    const r = agentCommissionSplit({ premium: 100, carrierCommissionPercent: 10, agentSplitPercent: 50, policies: 2, agencyFeePerPolicy: 10 });
    expect(r.agentShare).toBe(10); expect(r.agencyFees).toBe(20); expect(r.agentNet).toBe(-10); expect(r.agentEffectivePercentOfPremium).toBe(-5);
  });
  it("returns 0 effective percentage when premium is 0", () => {
    const r = agentCommissionSplit({ premium: 0, carrierCommissionPercent: 10, agentSplitPercent: 50, agencyFeePerPolicy: 5 });
    expect(r.grossCommission).toBe(0); expect(r.agentNet).toBe(-5); expect(r.agentEffectivePercentOfPremium).toBe(0);
  });
  it("rejects policies of 0", () => {
    expect(() => agentCommissionSplit({ premium: 1000, carrierCommissionPercent: 10, agentSplitPercent: 50, policies: 0 })).toThrow(/Policies must be more than 0/);
  });
  it("rejects any percentage above 100", () => {
    expect(() => agentCommissionSplit({ premium: 1000, carrierCommissionPercent: 101, agentSplitPercent: 50 })).toThrow(/Carrier commission percentage must be between 0 and 100/);
    expect(() => agentCommissionSplit({ premium: 1000, carrierCommissionPercent: 10, agentSplitPercent: 100.1 })).toThrow(/Agent split percentage must be between 0 and 100/);
  });
  it("rejects negative, non-numeric or missing input", () => {
    expect(() => agentCommissionSplit({ premium: -1, carrierCommissionPercent: 10, agentSplitPercent: 50 })).toThrow(/0 or more/);
    expect(() => agentCommissionSplit({ premium: 1000, carrierCommissionPercent: 10, agentSplitPercent: 50, agencyFeePerPolicy: NaN })).toThrow(/Agency fee per policy/);
    expect(() => agentCommissionSplit({ premium: 1000, carrierCommissionPercent: 10 })).toThrow(/Agent split percentage/);
  });
});
