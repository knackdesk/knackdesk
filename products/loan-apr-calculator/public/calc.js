const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function pmt(principal, monthlyRate, months) {
  return monthlyRate === 0 ? principal / months : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}
export function loanApr({ principal, annualRatePercent, termMonths, fees = 0 }) {
  if (num(principal, "Loan amount") <= 0) throw new Error("Loan amount must be above zero.");
  num(annualRatePercent, "Interest rate");
  if (num(termMonths, "Term") < 1) throw new Error("Term must be at least 1 month.");
  if (num(fees, "Fees") >= principal) throw new Error("Fees must be less than the loan amount.");
  const payment = round2(pmt(principal, annualRatePercent / 100 / 12, termMonths));
  const netAdvance = round2(principal - fees);
  let lo = 0, hi = 1;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (pmt(netAdvance, mid, termMonths) > payment) hi = mid; else lo = mid;
  }
  const aprPercent = fees === 0 ? round2(annualRatePercent) : round2(((lo + hi) / 2) * 12 * 100);
  return { payment, netAdvance, totalCost: round2(payment * termMonths + fees - principal), totalRepaid: round2(payment * termMonths), aprPercent, feesPercent: round2((fees / principal) * 100) };
}
