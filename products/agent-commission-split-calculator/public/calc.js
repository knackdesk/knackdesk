const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function agentCommissionSplit({ premium, carrierCommissionPercent, agentSplitPercent, policies = 1, agencyFeePerPolicy = 0 }) {
  num(premium, "Premium"); num(carrierCommissionPercent, "Carrier commission percentage"); num(agentSplitPercent, "Agent split percentage"); num(policies, "Policies"); num(agencyFeePerPolicy, "Agency fee per policy");
  if (carrierCommissionPercent > 100) throw new Error("Carrier commission percentage must be between 0 and 100.");
  if (agentSplitPercent > 100) throw new Error("Agent split percentage must be between 0 and 100.");
  if (policies === 0) throw new Error("Policies must be more than 0.");
  const gross = premium * (carrierCommissionPercent / 100) * policies;
  const agentShare = gross * (agentSplitPercent / 100);
  const fees = agencyFeePerPolicy * policies;
  const agentNet = agentShare - fees;
  const totalPremium = premium * policies;
  return {
    grossCommission: round2(gross), agentShare: round2(agentShare), agencyShare: round2(gross - agentShare),
    agencyFees: round2(fees), agentNet: round2(agentNet),
    agentEffectivePercentOfPremium: totalPremium > 0 ? round2((agentNet / totalPremium) * 100) : 0,
  };
}
