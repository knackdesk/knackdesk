const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function reorderPoint({ avgDailySales, avgLeadTimeDays, safetyStock, maxDailySales, maxLeadTimeDays, coverDays = 30 }) {
  num(avgDailySales, "Average daily sales"); num(avgLeadTimeDays, "Average lead time"); num(coverDays, "Cover days");
  let safety;
  if (typeof maxDailySales === "number" && typeof maxLeadTimeDays === "number") {
    if (num(maxDailySales, "Maximum daily sales") < avgDailySales || num(maxLeadTimeDays, "Maximum lead time") < avgLeadTimeDays) throw new Error("Maximum sales and lead time must be at least the averages.");
    safety = round2(maxDailySales * maxLeadTimeDays - avgDailySales * avgLeadTimeDays);
  } else {
    safety = num(typeof safetyStock === "number" ? safetyStock : 0, "Safety stock");
  }
  const demandDuringLeadTime = round2(avgDailySales * avgLeadTimeDays);
  return { safetyStock: safety, demandDuringLeadTime, reorderPoint: Math.ceil(demandDuringLeadTime + safety), orderQuantity: Math.ceil(avgDailySales * coverDays) };
}
