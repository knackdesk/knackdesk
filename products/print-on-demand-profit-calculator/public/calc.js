const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function podProfit({ salePrice, baseCost, shippingCharged = 0, shippingCost = 0, platformFeePercent = 0, paymentPercent = 0, paymentFixed = 0, targetProfit = 0 }) {
  if (num(salePrice, "Sale price") <= 0) throw new Error("Sale price must be above zero.");
  num(baseCost, "Base cost"); num(shippingCharged, "Shipping charged"); num(shippingCost, "Shipping cost"); num(platformFeePercent, "Platform fee");
  num(paymentPercent, "Payment fee"); num(paymentFixed, "Payment fixed fee"); num(targetProfit, "Target profit");
  const revenue = round2(salePrice + shippingCharged);
  const platformFee = round2(revenue * (platformFeePercent / 100));
  const paymentFee = round2(revenue * (paymentPercent / 100) + paymentFixed);
  const totalCosts = round2(baseCost + shippingCost + platformFee + paymentFee);
  const profit = round2(revenue - totalCosts);
  return { revenue, platformFee, paymentFee, totalCosts, profit, margin: round2((profit / revenue) * 100), salesForTarget: profit > 0 && targetProfit > 0 ? Math.ceil(targetProfit / profit) : null };
}
