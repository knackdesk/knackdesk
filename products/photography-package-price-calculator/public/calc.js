const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function packagePrice({ shootHours, editingHours = 0, hourlyRate, travel = 0, productsCost = 0, productsMarkupPercent = 0 }) {
  num(shootHours, "Shoot hours"); num(editingHours, "Editing hours");
  if (num(hourlyRate, "Hourly rate") <= 0) throw new Error("Hourly rate must be more than 0.");
  num(travel, "Travel"); num(productsCost, "Products cost"); num(productsMarkupPercent, "Products markup");
  const laborCost = (shootHours + editingHours) * hourlyRate;
  const productsPrice = productsCost * (1 + productsMarkupPercent / 100);
  return { laborCost: round2(laborCost), productsPrice: round2(productsPrice), packagePrice: round2(laborCost + travel + productsPrice), profitOnProducts: round2(productsPrice - productsCost) };
}
