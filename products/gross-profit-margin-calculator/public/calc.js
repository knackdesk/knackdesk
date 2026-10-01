const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function grossMargin({ revenue, cogs }) {
  if (num(revenue, "Revenue") <= 0) throw new Error("Revenue must be above zero.");
  num(cogs, "Cost of goods sold");
  const grossProfit = round2(revenue - cogs);
  return { grossProfit, marginPercent: round2((grossProfit / revenue) * 100), markupPercent: cogs > 0 ? round2((grossProfit / cogs) * 100) : null };
}
export function revenueForMargin({ cogs, targetMarginPercent }) {
  num(cogs, "Cost of goods sold");
  if (num(targetMarginPercent, "Target margin") >= 100) throw new Error("Target margin must be below 100 percent.");
  return round2(cogs / (1 - targetMarginPercent / 100));
}
