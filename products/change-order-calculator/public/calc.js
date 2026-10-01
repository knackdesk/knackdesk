// Half-up to the cent with a tolerance for binary floating error (so 14.275 rounds to 14.28, not 14.27).
const round2 = (n) => Math.round(n * 100 + (n >= 0 ? 1e-9 : -1e-9)) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function changeOrder({ originalContract, previousChangeOrders = 0, materials = 0, laborHours = 0, hourlyRate = 0, subcontractors = 0, markupPercent = 0, subMarkupPercent = 0 }) {
  if (num(originalContract, "Original contract") <= 0) throw new Error("Original contract must be above zero.");
  num(previousChangeOrders, "Previous change orders"); num(materials, "Materials"); num(laborHours, "Labour hours"); num(hourlyRate, "Hourly rate"); num(subcontractors, "Subcontractors"); num(markupPercent, "Markup"); num(subMarkupPercent, "Subcontractor markup");
  const laborCost = round2(laborHours * hourlyRate);
  const ownCost = round2(materials + laborCost);
  const ownMarkup = round2(ownCost * (markupPercent / 100));
  const subMarkup = round2(subcontractors * (subMarkupPercent / 100));
  const changePrice = round2(ownCost + ownMarkup + subcontractors + subMarkup);
  const revisedTotal = round2(originalContract + previousChangeOrders + changePrice);
  return { laborCost, ownCost, ownMarkup, subMarkup, changePrice, revisedTotal, changePercent: round2((changePrice / originalContract) * 100), cumulativePercent: round2(((previousChangeOrders + changePrice) / originalContract) * 100) };
}
