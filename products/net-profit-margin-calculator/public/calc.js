const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function netMargin({ revenue, cogs = 0, operatingExpenses = 0, interest = 0, taxes = 0 }) {
  if (num(revenue, "Revenue") <= 0) throw new Error("Revenue must be above zero.");
  num(cogs, "Cost of sales"); num(operatingExpenses, "Operating expenses"); num(interest, "Interest"); num(taxes, "Taxes");
  const grossProfit = round2(revenue - cogs);
  const operatingProfit = round2(grossProfit - operatingExpenses);
  const netProfit = round2(operatingProfit - interest - taxes);
  const pct = (n) => round2((n / revenue) * 100);
  return { grossProfit, grossMarginPercent: pct(grossProfit), operatingProfit, operatingMarginPercent: pct(operatingProfit), netProfit, netMarginPercent: pct(netProfit) };
}
