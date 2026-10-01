const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function checkMultiplier(m) {
  if (typeof m !== "number" || !Number.isFinite(m) || m < 1) throw new Error("Retail multiplier must be 1 or more (2 = keystone).");
}
function pack(cost, wholesale, retail) {
  return { wholesale: round2(wholesale), retail: round2(retail), wholesaleProfit: round2(wholesale - cost), wholesaleMarginPercent: wholesale > 0 ? round2(((wholesale - cost) / wholesale) * 100) : 0, retailerProfit: round2(retail - wholesale), retailMarginPercent: retail > 0 ? round2(((retail - wholesale) / retail) * 100) : 0, retailMarkupOnCost: cost > 0 ? round2(retail / cost) : null };
}
export function wholesaleFromCost({ cost, wholesaleMarginPercent, retailMultiplier = 2 }) {
  if (num(cost, "Cost") <= 0) throw new Error("Cost must be above zero.");
  if (num(wholesaleMarginPercent, "Wholesale margin") >= 100) throw new Error("Wholesale margin must be below 100 percent.");
  checkMultiplier(retailMultiplier);
  const wholesale = cost / (1 - wholesaleMarginPercent / 100);
  return pack(cost, wholesale, wholesale * retailMultiplier);
}
export function wholesaleFromRetail({ retail, retailMultiplier = 2, cost = 0 }) {
  if (num(retail, "Retail price") <= 0) throw new Error("Retail price must be above zero.");
  checkMultiplier(retailMultiplier); num(cost, "Cost");
  return pack(cost, retail / retailMultiplier, retail);
}
