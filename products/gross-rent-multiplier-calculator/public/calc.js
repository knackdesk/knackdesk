const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function grossRentMultiplier({ price, annualRent }) {
  if (num(price, "Price") <= 0) throw new Error("Price must be above zero.");
  if (num(annualRent, "Annual rent") <= 0) throw new Error("Annual rent must be above zero.");
  const monthlyRent = round2(annualRent / 12);
  return { grm: round2(price / annualRent), monthlyRent, rentToPricePercent: round2((monthlyRent / price) * 100), grossYieldPercent: round2((annualRent / price) * 100) };
}
export function priceForGrm({ annualRent, targetGrm }) {
  if (num(annualRent, "Annual rent") <= 0) throw new Error("Annual rent must be above zero.");
  if (num(targetGrm, "Target multiplier") <= 0) throw new Error("Target multiplier must be above zero.");
  return round2(annualRent * targetGrm);
}
