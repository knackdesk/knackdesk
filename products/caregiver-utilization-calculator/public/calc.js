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
export function caregiverUtilization({ paidHours, billableHours, travelHours = 0, trainingHours = 0, payRate = 0 }) {
  positive(paidHours, "Paid hours"); num(billableHours, "Billable hours"); num(travelHours, "Travel hours"); num(trainingHours, "Training hours"); num(payRate, "Pay rate");
  if (billableHours > paidHours) throw new Error("Billable hours cannot exceed the paid hours.");
  const nonBillableHours = paidHours - billableHours;
  if (travelHours + trainingHours > nonBillableHours) throw new Error("Travel and training hours cannot exceed the non-billable hours.");
  return {
    utilizationPercent: round2((billableHours / paidHours) * 100), nonBillableHours: round2(nonBillableHours),
    otherNonBillableHours: round2(nonBillableHours - travelHours - trainingHours), nonBillableCost: round2(nonBillableHours * payRate),
    travelSharePercent: round2((travelHours / paidHours) * 100), trainingSharePercent: round2((trainingHours / paidHours) * 100),
  };
}
