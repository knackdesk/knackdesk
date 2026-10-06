const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function recipeCost({ ingredients, wastePercent = 0, portions, menuPrice = 0 }) {
  if (!Array.isArray(ingredients) || ingredients.length === 0) throw new Error("Add at least one ingredient.");
  const rawCost = ingredients.reduce((sum, ing, i) => {
    const label = ing.name ? `${ing.name}` : `Ingredient ${i + 1}`;
    return sum + num(ing.quantity, `Quantity for ${label}`) * num(ing.unitCost, `Unit cost for ${label}`);
  }, 0);
  num(wastePercent, "Waste percentage"); num(menuPrice, "Menu price");
  if (num(portions, "Portions") <= 0) throw new Error("Portions must be more than 0.");
  const batchCost = rawCost * (1 + wastePercent / 100);
  const perPortion = batchCost / portions;
  return { rawCost: round2(rawCost), batchCost: round2(batchCost), costPerPortion: round2(perPortion), foodCostPercent: menuPrice > 0 ? round2((perPortion / menuPrice) * 100) : null };
}
