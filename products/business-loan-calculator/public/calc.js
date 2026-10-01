const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function pmt(principal, monthlyRate, months) {
  return monthlyRate === 0 ? principal / months : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}
function check(annualRatePercent, termMonths) {
  num(annualRatePercent, "Interest rate");
  if (num(termMonths, "Term") < 1) throw new Error("Term must be at least 1 month.");
  return annualRatePercent / 100 / 12;
}
export function loanPayment({ principal, annualRatePercent, termMonths }) {
  if (num(principal, "Loan amount") <= 0) throw new Error("Loan amount must be above zero.");
  const r = check(annualRatePercent, termMonths);
  const payment = round2(pmt(principal, r, termMonths));
  const totalRepaid = round2(payment * termMonths);
  return { payment, totalRepaid, totalInterest: round2(totalRepaid - principal), monthlyRatePercent: round2(r * 100 * 100) / 100 };
}
export function maxPrincipal({ payment, annualRatePercent, termMonths }) {
  if (num(payment, "Monthly payment") <= 0) throw new Error("Monthly payment must be above zero.");
  const r = check(annualRatePercent, termMonths);
  return round2(r === 0 ? payment * termMonths : (payment * (1 - Math.pow(1 + r, -termMonths))) / r);
}
