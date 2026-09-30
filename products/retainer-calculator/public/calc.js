const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function retainer({ hoursPerMonth, hourlyRate, discountPercent = 0, months = 12 }) {
  if (num(hoursPerMonth, "Hours per month") <= 0) throw new Error("Hours per month must be above zero.");
  num(hourlyRate, "Hourly rate");
  if (num(discountPercent, "Discount") >= 100) throw new Error("Discount must be below 100 percent.");
  if (num(months, "Months") <= 0) throw new Error("Months must be above zero.");
  const listPrice = round2(hoursPerMonth * hourlyRate);
  const monthlyFee = round2(listPrice * (1 - discountPercent / 100));
  return { listPrice, monthlyFee, effectiveRate: round2(monthlyFee / hoursPerMonth), termTotal: round2(monthlyFee * months), discountValue: round2((listPrice - monthlyFee) * months) };
}
