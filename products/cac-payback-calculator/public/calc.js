const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function cacPayback({ cac, spend, newCustomers, arpa, marginPercent }) {
  let acquisitionCost;
  if (typeof cac === "number" && Number.isFinite(cac)) {
    acquisitionCost = num(cac, "CAC");
  } else {
    num(spend, "Sales and marketing spend");
    if (!Number.isFinite(newCustomers) || newCustomers <= 0) throw new Error("New customers must be above zero.");
    acquisitionCost = round2(spend / newCustomers);
  }
  if (num(marginPercent, "Gross margin") > 100) throw new Error("Gross margin cannot exceed 100 percent.");
  const monthlyContribution = round2(num(arpa, "Monthly revenue per account") * (marginPercent / 100));
  if (monthlyContribution <= 0) throw new Error("Monthly revenue per account times margin must be above zero.");
  return { cac: acquisitionCost, monthlyContribution, paybackMonths: round2(acquisitionCost / monthlyContribution) };
}
