const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function contributionMargin({ price, cost = 0, feesPercent = 0, otherCosts = 0 }) {
  if (num(price, "Price") <= 0) throw new Error("Price must be above zero.");
  num(cost, "Product cost"); num(otherCosts, "Other costs");
  if (num(feesPercent, "Fees") > 100) throw new Error("Fees cannot exceed 100 percent.");
  return round2(((price - cost - otherCosts - price * (feesPercent / 100)) / price) * 100);
}
export function roas({ marginPercent, targetProfitPercent = 0 }) {
  if (num(marginPercent, "Contribution margin") <= 0 || marginPercent > 100) throw new Error("Contribution margin must be above 0 and at most 100 percent.");
  if (num(targetProfitPercent, "Target profit") >= marginPercent) throw new Error("Target profit must be below the contribution margin.");
  return {
    breakEvenRoas: round2(1 / (marginPercent / 100)),
    targetRoas: round2(1 / ((marginPercent - targetProfitPercent) / 100)),
    maxCpaPercent: round2(marginPercent),
  };
}
