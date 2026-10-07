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
export function designFee({ conceptHours = 0, developmentHours = 0, documentationHours = 0, siteVisits = 0, hoursPerVisit = 0, hourlyRate, contingencyPercent = 0 }) {
  num(conceptHours, "Concept hours"); num(developmentHours, "Design development hours"); num(documentationHours, "Documentation hours"); num(siteVisits, "Site visits"); num(hoursPerVisit, "Hours per visit"); num(hourlyRate, "Hourly rate"); num(contingencyPercent, "Contingency percentage");
  positive(hourlyRate, "Hourly rate");
  const siteVisitHours = siteVisits * hoursPerVisit;
  const totalHours = conceptHours + developmentHours + documentationHours + siteVisitHours;
  if (totalHours === 0) throw new Error("Enter at least some hours.");
  const baseFee = totalHours * hourlyRate;
  const contingencyAmount = baseFee * contingencyPercent / 100;
  return {
    totalHours: round2(totalHours), siteVisitHours: round2(siteVisitHours), baseFee: round2(baseFee),
    contingencyAmount: round2(contingencyAmount), designFee: round2(baseFee + contingencyAmount),
  };
}
