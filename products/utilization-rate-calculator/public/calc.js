const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function utilization({ billableHours, availableHours, hourlyRate = 0, targetPercent = 0 }) {
  num(billableHours, "Billable hours");
  if (num(availableHours, "Available hours") <= 0) throw new Error("Available hours must be above zero.");
  if (billableHours > availableHours) throw new Error("Billable hours cannot exceed available hours.");
  num(hourlyRate, "Hourly rate");
  if (num(targetPercent, "Target utilization") > 100) throw new Error("Target utilization cannot exceed 100 percent.");
  const targetHours = availableHours * (targetPercent / 100);
  return { ratePercent: round2((billableHours / availableHours) * 100), nonBillableHours: round2(availableHours - billableHours), billableRevenue: round2(billableHours * hourlyRate), hoursToTarget: round2(Math.max(0, targetHours - billableHours)), revenueAtTarget: round2(targetHours * hourlyRate) };
}
