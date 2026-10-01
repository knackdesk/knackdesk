const round2 = (n) => Math.round(n * 100) / 100;

function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}

function rate(v, name = "Commission rate") {
  if (num(v, name) > 100) throw new Error(`${name} cannot exceed 100 percent.`);
  return v;
}

const effective = (commission, amount) => (amount === 0 ? 0 : round2((commission / amount) * 100));

export function flatCommission({ amount, ratePercent }) {
  num(amount, "Sale amount"); rate(ratePercent);
  const commission = round2(amount * (ratePercent / 100));
  return { commission, effectiveRate: effective(commission, amount) };
}

function checkTiers(tiers) {
  if (!Array.isArray(tiers) || tiers.length === 0) throw new Error("Add at least one tier.");
  tiers.forEach((t, i) => {
    rate(t.ratePercent, `Tier ${i + 1} rate`);
    const last = i === tiers.length - 1;
    if (last && t.upTo !== null) throw new Error("The last tier must have no upper limit (leave it blank).");
    if (!last) {
      if (typeof t.upTo !== "number" || !Number.isFinite(t.upTo) || t.upTo <= 0) throw new Error(`Tier ${i + 1} upper limit must be a number above 0.`);
      if (i > 0 && t.upTo <= tiers[i - 1].upTo) throw new Error("Tier upper limits must be in ascending order.");
    }
  });
}

export function tieredCommission({ amount, tiers }) {
  num(amount, "Sale amount");
  checkTiers(tiers);
  let lower = 0;
  const breakdown = tiers.map((t) => {
    const upper = t.upTo === null ? Infinity : t.upTo;
    const inTier = Math.max(0, Math.min(amount, upper) - lower);
    const row = { from: lower, upTo: t.upTo, ratePercent: t.ratePercent, amountInTier: round2(inTier), commission: round2(inTier * (t.ratePercent / 100)) };
    lower = upper;
    return row;
  });
  const commission = round2(breakdown.reduce((s, b) => s + b.commission, 0));
  return { commission, effectiveRate: effective(commission, amount), breakdown };
}

export function salesForTarget({ targetCommission, ratePercent }) {
  num(targetCommission, "Target commission");
  if (rate(ratePercent) === 0) throw new Error("Commission rate must be above 0 to reach a target.");
  return round2(targetCommission / (ratePercent / 100));
}
