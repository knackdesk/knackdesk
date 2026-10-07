const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function percent(v, name) {
  num(v, name);
  if (v > 100) throw new Error(`${name} cannot be more than 100.`);
  return v;
}
export function hourlyVsPercentageFee({ projectBudget, percentageFee, estimatedHours, hourlyRate, overrunPercent = 0 }) {
  num(projectBudget, "Project budget"); num(percentageFee, "Percentage fee"); num(estimatedHours, "Estimated hours"); num(hourlyRate, "Hourly rate"); num(overrunPercent, "Overrun percentage");
  percent(percentageFee, "Percentage fee");
  const percentageFeeAmount = projectBudget * percentageFee / 100;
  const hourlyFeeAmount = estimatedHours * hourlyRate;
  const hourlyFeeAtOverrun = estimatedHours * (1 + overrunPercent / 100) * hourlyRate;
  return {
    percentageFeeAmount: round2(percentageFeeAmount), hourlyFeeAmount: round2(hourlyFeeAmount), difference: round2(percentageFeeAmount - hourlyFeeAmount),
    impliedHourlyRate: estimatedHours > 0 ? round2(percentageFeeAmount / estimatedHours) : null,
    hourlyFeeAtOverrun: round2(hourlyFeeAtOverrun),
    breakEvenHours: hourlyRate > 0 ? round2(percentageFeeAmount / hourlyRate) : null,
  };
}
