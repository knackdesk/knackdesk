const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function positive(v, name) {
  num(v, name);
  if (v === 0) throw new Error(`${name} must be more than 0.`);
  return v;
}
export function tempStaffingMargin({ payRate, onCostsPercent = 0, markupPercent = 0, billRate = 0, hoursPerWeek = 40, weeks = 1 }) {
  positive(payRate, "Pay rate"); num(onCostsPercent, "On-costs percentage"); num(markupPercent, "Markup percentage"); num(billRate, "Bill rate"); num(hoursPerWeek, "Hours per week"); num(weeks, "Weeks");
  const billRateUsed = billRate > 0 ? billRate : payRate * (1 + markupPercent / 100);
  const loadedCostPerHour = payRate * (1 + onCostsPercent / 100);
  const grossMarginPerHour = billRateUsed - loadedCostPerHour;
  const marginPerWeek = grossMarginPerHour * hoursPerWeek;
  return {
    billRateUsed: round2(billRateUsed), loadedCostPerHour: round2(loadedCostPerHour), grossMarginPerHour: round2(grossMarginPerHour),
    grossMarginPercent: billRateUsed > 0 ? round2((grossMarginPerHour / billRateUsed) * 100) : 0,
    billPerWeek: round2(billRateUsed * hoursPerWeek), marginPerWeek: round2(marginPerWeek), marginForAssignment: round2(marginPerWeek * weeks),
  };
}
