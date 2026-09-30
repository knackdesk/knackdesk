const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function effectiveRate({ fee, expenses = 0, hours, targetRate }) {
  num(fee, "Project fee");
  if (num(expenses, "Expenses") > fee) throw new Error("Expenses cannot be higher than the fee.");
  if (num(hours, "Hours") <= 0) throw new Error("Hours must be above zero.");
  const net = round2(fee - expenses);
  const hourly = round2(net / hours);
  const hasTarget = typeof targetRate === "number" && Number.isFinite(targetRate) && targetRate > 0;
  return {
    net,
    hourly,
    vsTargetPercent: hasTarget ? round2(((hourly - targetRate) / targetRate) * 100) : null,
    hoursAtTarget: hasTarget ? round2(net / targetRate) : null,
  };
}
