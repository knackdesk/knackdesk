const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function pmt(principal, monthlyRate, months) {
  return monthlyRate === 0 ? principal / months : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}
export function leaseVsBuy({ price, deposit = 0, loanRatePercent = 0, loanMonths, resaleValue = 0, leaseMonthly, leaseMonths, leaseBuyout = 0 }) {
  if (num(price, "Purchase price") <= 0) throw new Error("Purchase price must be above zero.");
  num(deposit, "Deposit"); num(loanRatePercent, "Loan rate"); num(resaleValue, "Resale value"); num(leaseMonthly, "Lease payment"); num(leaseBuyout, "Lease buyout");
  if (num(loanMonths, "Loan term") < 1) throw new Error("Loan term must be at least 1 month.");
  if (num(leaseMonths, "Lease term") < 1) throw new Error("Lease term must be at least 1 month.");
  if (deposit > price) throw new Error("Deposit cannot exceed the purchase price.");
  const financed = price - deposit;
  const loanPayment = round2(pmt(financed, loanRatePercent / 100 / 12, loanMonths));
  const buyTotal = round2(deposit + loanPayment * loanMonths - resaleValue);
  const leaseTotal = round2(leaseMonthly * leaseMonths + leaseBuyout - (leaseBuyout > 0 ? resaleValue : 0));
  const difference = round2(Math.abs(buyTotal - leaseTotal));
  return { loanPayment, buyTotal, leaseTotal, cheaper: buyTotal === leaseTotal ? "same" : buyTotal < leaseTotal ? "buy" : "lease", difference, buyMonthlyEquivalent: round2(buyTotal / loanMonths), leaseMonthlyEquivalent: round2(leaseTotal / leaseMonths) };
}
