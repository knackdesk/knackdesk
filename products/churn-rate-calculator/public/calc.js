const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function churn({ startCustomers, lostCustomers, startMrr, lostMrr }) {
  if (num(startCustomers, "Customers at start") <= 0) throw new Error("Customers at start must be above zero.");
  if (num(lostCustomers, "Customers lost") > startCustomers) throw new Error("Customers lost cannot exceed customers at start.");
  const customerChurn = round2((lostCustomers / startCustomers) * 100);
  const hasRevenue = typeof startMrr === "number" && startMrr > 0 && typeof lostMrr === "number";
  let revenueChurn = null;
  if (hasRevenue) {
    if (num(lostMrr, "Revenue lost") > startMrr) throw new Error("Revenue lost cannot exceed starting revenue.");
    revenueChurn = round2((lostMrr / startMrr) * 100);
  }
  const annualised = (monthly) => round2((1 - Math.pow(1 - monthly / 100, 12)) * 100);
  return {
    customerChurn,
    customerRetention: round2(100 - customerChurn),
    revenueChurn,
    revenueRetention: revenueChurn === null ? null : round2(100 - revenueChurn),
    annualisedCustomerChurn: annualised(customerChurn),
    annualisedRevenueChurn: revenueChurn === null ? null : annualised(revenueChurn),
  };
}
