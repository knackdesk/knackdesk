const round2 = (n) => Math.round(n * 100) / 100;

function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}

export function breakEven({ fixedCosts, pricePerUnit, variableCostPerUnit, targetProfit = 0 }) {
  num(fixedCosts, "Fixed costs");
  num(pricePerUnit, "Price per unit");
  num(variableCostPerUnit, "Variable cost per unit");
  num(targetProfit, "Target profit");
  const contributionMargin = round2(pricePerUnit - variableCostPerUnit);
  if (contributionMargin <= 0) throw new Error("Price per unit must be higher than the variable cost per unit, or you can never break even.");
  const units = Math.ceil((fixedCosts + targetProfit) / contributionMargin);
  return {
    contributionMargin,
    contributionMarginRatio: round2((contributionMargin / pricePerUnit) * 100),
    units,
    revenue: round2(units * pricePerUnit),
  };
}
