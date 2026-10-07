const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function pct(v, name) {
  num(v, name);
  if (v > 100) throw new Error(`${name} must be between 0 and 100.`);
  return v;
}
export function renewalCommission({ policies, averagePremium, renewalCommissionPercent, retentionPercent = 100, years = 1, newBusinessCommissionPercent = 0 }) {
  num(policies, "Policies"); num(averagePremium, "Average premium"); pct(renewalCommissionPercent, "Renewal commission percentage"); pct(retentionPercent, "Retention percentage"); num(years, "Years"); pct(newBusinessCommissionPercent, "New business commission percentage");
  if (policies === 0) throw new Error("Policies must be more than 0.");
  if (years < 1 || !Number.isInteger(years)) throw new Error("Years must be a whole number of 1 or more.");
  const book = policies * averagePremium * (renewalCommissionPercent / 100);
  const keep = retentionPercent / 100;
  let residuals = 0;
  for (let n = 1; n <= years; n += 1) residuals += book * keep ** n;
  return {
    annualBookCommission: round2(book), newBusinessCommission: round2(policies * averagePremium * (newBusinessCommissionPercent / 100)),
    firstYearRenewal: round2(book * keep), residualsOverYears: round2(residuals), policiesRemainingAfterYears: round2(policies * keep ** years),
  };
}
