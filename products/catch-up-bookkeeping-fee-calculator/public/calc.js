const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function catchUpBookkeepingFee({ monthsBehind, hoursPerMonth, hourlyRate, setupFee = 0, discountPercent = 0 }) {
  num(hoursPerMonth, "Hours per month"); num(hourlyRate, "Hourly rate"); num(setupFee, "Setup fee");
  if (num(monthsBehind, "Months behind") <= 0) throw new Error("Months behind must be more than 0.");
  if (num(discountPercent, "Discount percentage") > 100) throw new Error("Discount percentage must be 100 or less.");
  const totalHours = monthsBehind * hoursPerMonth;
  const labourCost = totalHours * hourlyRate;
  const subtotal = labourCost + setupFee;
  const discount = subtotal * (discountPercent / 100);
  const total = subtotal - discount;
  return { totalHours: round2(totalHours), labourCost: round2(labourCost), subtotal: round2(subtotal), discount: round2(discount), total: round2(total), perMonth: round2(total / monthsBehind) };
}
