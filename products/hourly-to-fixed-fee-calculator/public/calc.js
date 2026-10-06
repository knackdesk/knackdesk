const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function hourlyToFixedFee({ hoursPerMonth, hourlyRate, bufferPercent = 0, commitmentDiscountPercent = 0, overrunPercent = 0 }) {
  num(hourlyRate, "Hourly rate"); num(bufferPercent, "Buffer percentage"); num(overrunPercent, "Overrun percentage");
  if (num(hoursPerMonth, "Hours per month") <= 0) throw new Error("Hours per month must be more than 0.");
  if (num(commitmentDiscountPercent, "Commitment discount percentage") > 100) throw new Error("Commitment discount percentage must be 100 or less.");
  const baseMonthly = hoursPerMonth * hourlyRate;
  const withBuffer = baseMonthly * (1 + bufferPercent / 100);
  const fixedFee = withBuffer * (1 - commitmentDiscountPercent / 100);
  const effectiveHourlyAtOverrun = fixedFee / (hoursPerMonth * (1 + overrunPercent / 100));
  return { baseMonthly: round2(baseMonthly), withBuffer: round2(withBuffer), fixedFee: round2(fixedFee), annualFee: round2(fixedFee * 12), effectiveHourlyAtOverrun: round2(effectiveHourlyAtOverrun) };
}
