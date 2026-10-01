const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function ltv({ arpa, marginPercent, churnPercent, cac }) {
  num(arpa, "Revenue per account");
  if (num(marginPercent, "Gross margin") > 100) throw new Error("Gross margin cannot exceed 100 percent.");
  if (num(churnPercent, "Monthly churn") <= 0 || churnPercent > 100) throw new Error("Monthly churn must be above 0 and at most 100 percent.");
  const lifetimeMonths = round2(1 / (churnPercent / 100));
  const value = round2(arpa * (marginPercent / 100) * (1 / (churnPercent / 100)));
  const hasCac = typeof cac === "number" && Number.isFinite(cac) && cac > 0;
  return { lifetimeMonths, ltv: value, ltvToCac: hasCac ? round2(value / cac) : null };
}
