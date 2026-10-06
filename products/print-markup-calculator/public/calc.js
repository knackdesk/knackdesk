const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function printCost(labCost, shipping) {
  const cost = num(labCost, "Lab cost") + num(shipping, "Shipping");
  if (cost <= 0) throw new Error("Lab cost plus shipping must be more than 0.");
  return cost;
}
export function printMarkup({ labCost, shipping = 0, markupPercent }) {
  const cost = printCost(labCost, shipping);
  const price = cost * (1 + num(markupPercent, "Markup") / 100);
  const profit = price - cost;
  return { cost: round2(cost), price: round2(price), profit: round2(profit), marginPercent: round2((profit / price) * 100) };
}
export function printPriceForMargin({ labCost, shipping = 0, marginPercent }) {
  const cost = printCost(labCost, shipping);
  if (num(marginPercent, "Profit margin") >= 100) throw new Error("Profit margin must be below 100 percent of the price.");
  const price = cost / (1 - marginPercent / 100);
  const profit = price - cost;
  return { cost: round2(cost), price: round2(price), profit: round2(profit), markupPercent: round2((profit / cost) * 100) };
}
