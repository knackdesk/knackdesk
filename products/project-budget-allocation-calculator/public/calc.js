const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function positive(v, name) {
  num(v, name);
  if (v === 0) throw new Error(`${name} must be more than 0.`);
  return v;
}
function percent(v, name) {
  num(v, name);
  if (v > 100) throw new Error(`${name} cannot be more than 100.`);
  return v;
}
export function projectBudgetAllocation({ totalBudget, designFeePercent = 0, furniturePercent = 0, constructionPercent = 0, contingencyPercent = 0 }) {
  num(totalBudget, "Total budget"); num(designFeePercent, "Design fee percentage"); num(furniturePercent, "Furniture percentage"); num(constructionPercent, "Construction percentage"); num(contingencyPercent, "Contingency percentage");
  positive(totalBudget, "Total budget");
  percent(designFeePercent, "Design fee percentage"); percent(furniturePercent, "Furniture percentage"); percent(constructionPercent, "Construction percentage"); percent(contingencyPercent, "Contingency percentage");
  const share = (pct) => totalBudget * pct / 100;
  const designFee = share(designFeePercent);
  const furniture = share(furniturePercent);
  const construction = share(constructionPercent);
  const contingency = share(contingencyPercent);
  const allocatedAmount = designFee + furniture + construction + contingency;
  return {
    designFee: round2(designFee), furniture: round2(furniture), construction: round2(construction), contingency: round2(contingency),
    allocatedPercent: round2(designFeePercent + furniturePercent + constructionPercent + contingencyPercent),
    allocatedAmount: round2(allocatedAmount), remaining: round2(totalBudget - allocatedAmount),
  };
}
