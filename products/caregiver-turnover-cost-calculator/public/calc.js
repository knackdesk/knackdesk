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
export function caregiverTurnoverCost({ caregivers, leaversPerYear, recruitingCostPerHire = 0, onboardingHours = 0, trainerCostPerHour = 0, unfilledHoursPerLeaver = 0, marginPerBillableHour = 0 }) {
  positive(caregivers, "Caregivers"); num(leaversPerYear, "Leavers per year"); num(recruitingCostPerHire, "Recruiting cost per hire"); num(onboardingHours, "Onboarding hours"); num(trainerCostPerHour, "Trainer cost per hour"); num(unfilledHoursPerLeaver, "Unfilled hours per leaver"); num(marginPerBillableHour, "Margin per billable hour");
  const costPerLeaver = recruitingCostPerHire + onboardingHours * trainerCostPerHour + unfilledHoursPerLeaver * marginPerBillableHour;
  const annualTurnoverCost = costPerLeaver * leaversPerYear;
  return {
    turnoverPercent: round2((leaversPerYear / caregivers) * 100), costPerLeaver: round2(costPerLeaver), annualTurnoverCost: round2(annualTurnoverCost),
    costPerCaregiver: round2(annualTurnoverCost / caregivers), savingIfTurnoverHalved: round2(annualTurnoverCost / 2),
  };
}
