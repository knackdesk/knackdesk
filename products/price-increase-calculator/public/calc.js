const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function applyIncrease({ price, percent }) {
  num(price, "Price");
  if (typeof percent !== "number" || !Number.isFinite(percent)) throw new Error("Percent must be a number.");
  const newPrice = round2(price * (1 + percent / 100));
  return { newPrice, difference: round2(newPrice - price) };
}
export function percentBetween({ oldPrice, newPrice }) {
  if (num(oldPrice, "Old price") === 0) throw new Error("Old price must be above zero.");
  num(newPrice, "New price");
  return round2(((newPrice - oldPrice) / oldPrice) * 100);
}
export function increaseToKeepMargin({ oldCost, newCost, oldPrice }) {
  num(oldCost, "Old cost"); num(newCost, "New cost");
  if (num(oldPrice, "Old price") <= oldCost) throw new Error("Old price must be above old cost, otherwise there is no margin to keep.");
  const marginPercent = round2(((oldPrice - oldCost) / oldPrice) * 100);
  const newPrice = round2(newCost / (1 - marginPercent / 100));
  return { newPrice, increasePercent: round2(((newPrice - oldPrice) / oldPrice) * 100), marginPercent };
}
