const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function pmt(principal, monthlyRate, months) {
  return monthlyRate === 0 ? principal / months : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}
export function extraPayment({ principal, annualRatePercent, termMonths, extraMonthly = 0 }) {
  if (num(principal, "Loan balance") <= 0) throw new Error("Loan balance must be above zero.");
  num(annualRatePercent, "Interest rate"); num(extraMonthly, "Extra payment");
  if (num(termMonths, "Term") < 1) throw new Error("Term must be at least 1 month.");
  const r = annualRatePercent / 100 / 12;
  const scheduledPayment = round2(pmt(principal, r, termMonths));
  const scheduledInterest = round2(scheduledPayment * termMonths - principal);
  let balance = principal, months = 0, interest = 0;
  while (balance > 0.005 && months < 1200) {
    const i = balance * r; interest += i;
    const last = months === termMonths - 1;
    const pay = last ? balance + i : Math.min(scheduledPayment + extraMonthly, balance + i);
    balance = balance + i - pay; months += 1;
  }
  const newInterest = round2(interest);
  return { scheduledPayment, scheduledInterest, newMonths: months, newInterest, interestSaved: round2(scheduledInterest - newInterest), monthsSaved: Math.max(0, termMonths - months), totalMonthlyPayment: round2(scheduledPayment + extraMonthly) };
}
