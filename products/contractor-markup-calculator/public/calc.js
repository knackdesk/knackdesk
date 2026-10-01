const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function markupFromCost({ cost, markupPercent }) {
  if (num(cost, "Cost") <= 0) throw new Error("Cost must be above zero.");
  num(markupPercent, "Markup");
  const price = round2(cost * (1 + markupPercent / 100));
  const profit = round2(price - cost);
  return { price, profit, marginPercent: round2((profit / price) * 100) };
}
export function markupForMargin({ cost, marginPercent }) {
  if (num(cost, "Cost") <= 0) throw new Error("Cost must be above zero.");
  if (num(marginPercent, "Margin") >= 100) throw new Error("Margin must be below 100 percent.");
  const m = marginPercent / 100;
  const price = round2(cost / (1 - m));
  return { markupPercent: round2((m / (1 - m)) * 100), price, profit: round2(price - cost) };
}
export function markupForOverheadAndProfit({ overheadPercent, profitPercent }) {
  num(overheadPercent, "Overhead"); num(profitPercent, "Profit");
  const share = (overheadPercent + profitPercent) / 100;
  if (share >= 1) throw new Error("Overhead plus profit must be below 100 percent of sales.");
  return { markupPercent: round2((1 / (1 - share) - 1) * 100), marginPercent: round2(share * 100) };
}
