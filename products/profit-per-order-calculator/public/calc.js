const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function pct(v, name) {
  if (num(v, name) > 100) throw new Error(`${name} cannot exceed 100 percent.`);
  return v;
}
export function orderProfit({ price, cost = 0, packaging = 0, shippingCharged = 0, shippingPaid = 0, platformFeePercent = 0, paymentFeePercent = 0, paymentFeeFixed = 0 }) {
  num(price, "Sale price"); num(cost, "Product cost"); num(packaging, "Packaging"); num(shippingCharged, "Shipping charged"); num(shippingPaid, "Shipping paid");
  pct(platformFeePercent, "Platform fee"); pct(paymentFeePercent, "Payment fee"); num(paymentFeeFixed, "Fixed payment fee");
  const revenue = round2(price + shippingCharged);
  const fees = round2(revenue * (platformFeePercent / 100) + revenue * (paymentFeePercent / 100) + paymentFeeFixed);
  const profit = round2(revenue - cost - packaging - shippingPaid - fees);
  return { revenue, fees, profit, marginPercent: revenue > 0 ? round2((profit / revenue) * 100) : 0 };
}
