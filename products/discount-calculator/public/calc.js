const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function pct(v) {
  if (num(v, "Discount") > 100) throw new Error("Discount cannot exceed 100 percent.");
  return v;
}
export function applyDiscount({ price, percent }) {
  num(price, "Price"); pct(percent);
  const saved = round2(price * (percent / 100));
  return { finalPrice: round2(price - saved), saved };
}
export function discountBetween({ original, sale }) {
  if (num(original, "Original price") === 0) throw new Error("Original price must be above zero.");
  if (num(sale, "Sale price") > original) throw new Error("Sale price must not be above the original price.");
  return round2(((original - sale) / original) * 100);
}
export function stackDiscounts({ price, percents }) {
  num(price, "Price");
  if (!Array.isArray(percents) || percents.length === 0) throw new Error("Enter at least one discount.");
  const factor = percents.reduce((f, p) => f * (1 - pct(p) / 100), 1);
  const finalPrice = round2(price * factor);
  return { finalPrice, saved: round2(price - finalPrice), combinedPercent: round2((1 - factor) * 100) };
}
