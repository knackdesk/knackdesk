const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function threshold({ aov, marginPercent, shippingCost, chosenThreshold }) {
  num(aov, "Average order value"); num(shippingCost, "Shipping cost");
  if (num(marginPercent, "Gross margin") <= 0 || marginPercent > 100) throw new Error("Gross margin must be above 0 and at most 100 percent.");
  const m = marginPercent / 100;
  const breakEvenThreshold = round2(shippingCost / m);
  const out = { breakEvenThreshold, upliftNeeded: round2(Math.max(0, breakEvenThreshold - aov)), profitAtChosen: null, extraProfitAtChosen: null };
  if (typeof chosenThreshold === "number" && Number.isFinite(chosenThreshold) && chosenThreshold >= 0) {
    const profitAtChosen = round2(chosenThreshold * m - shippingCost);
    out.profitAtChosen = profitAtChosen;
    out.extraProfitAtChosen = profitAtChosen;
    out.chosenUplift = round2(chosenThreshold - aov);
  }
  return out;
}
