const round2 = (n) => Math.round(n * 100) / 100;

function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}

export function solve(input) {
  const given = Object.entries(input).filter(([, v]) => v !== undefined && v !== null && v !== "");
  if (given.length !== 2) throw new Error("Enter exactly two values and leave the other two empty.");
  const { cost, price, markupPercent, marginPercent } = Object.fromEntries(given);
  if (marginPercent !== undefined && num(marginPercent, "Margin") >= 100) throw new Error("Margin must be below 100 percent.");
  let c, p;
  if (cost !== undefined && price !== undefined) { c = num(cost, "Cost"); p = num(price, "Price"); }
  else if (cost !== undefined && markupPercent !== undefined) { c = num(cost, "Cost"); p = c * (1 + num(markupPercent, "Markup") / 100); }
  else if (cost !== undefined && marginPercent !== undefined) { c = num(cost, "Cost"); p = c / (1 - marginPercent / 100); }
  else if (price !== undefined && marginPercent !== undefined) { p = num(price, "Price"); c = p * (1 - marginPercent / 100); }
  else if (price !== undefined && markupPercent !== undefined) { p = num(price, "Price"); c = p / (1 + num(markupPercent, "Markup") / 100); }
  else throw new Error("Enter any two of cost, price, markup or margin.");
  const profit = p - c;
  return {
    cost: round2(c),
    price: round2(p),
    profit: round2(profit),
    markupPercent: c === 0 ? 0 : round2((profit / c) * 100),
    marginPercent: p === 0 ? 0 : round2((profit / p) * 100),
  };
}
