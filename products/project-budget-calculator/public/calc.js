const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function projectBudget({ hours, hourlyRate, expenses = 0, contingencyPercent = 0, discountPercent = 0, hoursPerDay = 8 }) {
  num(hours, "Hours"); num(hourlyRate, "Hourly rate"); num(expenses, "Expenses"); num(contingencyPercent, "Contingency");
  if (num(discountPercent, "Discount") >= 100) throw new Error("Discount must be below 100 percent.");
  if (num(hoursPerDay, "Hours per day") <= 0) throw new Error("Hours per day must be above zero.");
  const laborCost = round2(hours * hourlyRate);
  const subtotal = round2(laborCost + expenses);
  const contingency = round2(subtotal * (contingencyPercent / 100));
  const beforeDiscount = round2(subtotal + contingency);
  const discount = round2(beforeDiscount * (discountPercent / 100));
  return { laborCost, subtotal, contingency, beforeDiscount, discount, total: round2(beforeDiscount - discount), workingDays: round2(hours / hoursPerDay) };
}
