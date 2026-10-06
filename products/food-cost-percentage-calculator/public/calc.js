const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function foodCostPercent({ ingredientCost, menuPrice }) {
  num(ingredientCost, "Ingredient cost");
  if (num(menuPrice, "Menu price") <= 0) throw new Error("Menu price must be more than 0.");
  const grossProfit = menuPrice - ingredientCost;
  return { foodCostPercent: round2((ingredientCost / menuPrice) * 100), grossProfit: round2(grossProfit), grossMarginPercent: round2((grossProfit / menuPrice) * 100) };
}
export function priceForFoodCost({ ingredientCost, targetFoodCostPercent }) {
  num(ingredientCost, "Ingredient cost");
  const t = num(targetFoodCostPercent, "Target food cost percentage");
  if (t <= 0 || t >= 100) throw new Error("Target food cost percentage must be more than 0 and less than 100.");
  return { price: round2(ingredientCost / (t / 100)) };
}
