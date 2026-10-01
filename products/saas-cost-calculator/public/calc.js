const round2 = (n) => Math.round(n * 100) / 100;
const PERIODS = ["month", "year"];

const isNum = (v) => typeof v === "number" && Number.isFinite(v);

function costItem(item, index) {
  const label = typeof item.name === "string" && item.name.trim() ? item.name.trim() : `Row ${index + 1}`;
  const { price, period, seats = 1, annualDiscountPercent = 0 } = item;
  if (!isNum(price) || price < 0) throw new Error(`${label}: price must be a number of 0 or more.`);
  if (!PERIODS.includes(period)) throw new Error(`${label}: billing period must be "month" or "year".`);
  if (!Number.isInteger(seats) || seats < 1) throw new Error(`${label}: seats must be a whole number of 1 or more.`);
  if (!isNum(annualDiscountPercent) || annualDiscountPercent < 0 || annualDiscountPercent > 100) {
    throw new Error(`${label}: annual discount must be between 0 and 100 percent.`);
  }
  const monthly = period === "month" ? price * seats : (price * seats) / 12;
  const yearly = monthly * 12;
  const saving = period === "month" ? yearly * (annualDiscountPercent / 100) : 0;
  return { name: label, monthly: round2(monthly), yearly: round2(yearly), saving: round2(saving) };
}

export function stackCost({ items }) {
  if (!Array.isArray(items) || items.length === 0) throw new Error("Add at least one subscription.");
  const rows = items.map(costItem);
  const sum = (key) => round2(rows.reduce((t, r) => t + r[key], 0));
  return { items: rows, totalMonthly: sum("monthly"), totalYearly: sum("yearly"), totalSaving: sum("saving") };
}
