const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function cateringPrice({ guests, foodCostPerGuest, laborHours = 0, hourlyRate = 0, rentals = 0, otherCosts = 0, marginPercent = 0 }) {
  if (num(guests, "Guests") <= 0) throw new Error("Guests must be more than 0.");
  num(foodCostPerGuest, "Food cost per guest"); num(laborHours, "Labour hours"); num(hourlyRate, "Hourly rate"); num(rentals, "Rentals"); num(otherCosts, "Other costs");
  if (num(marginPercent, "Profit margin") >= 100) throw new Error("Profit margin must be below 100 percent of the price.");
  const foodCost = round2(guests * foodCostPerGuest);
  const laborCost = round2(laborHours * hourlyRate);
  const totalCost = round2(foodCost + laborCost + rentals + otherCosts);
  const price = round2(totalCost / (1 - marginPercent / 100));
  return { foodCost, laborCost, totalCost, price, pricePerGuest: round2(price / guests), profit: round2(price - totalCost), costPerGuest: round2(totalCost / guests) };
}
