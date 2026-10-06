const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function blockHoursPrice({ hoursInBlock, hourlyRate, discountPercent = 0, expiryMonths = 0, expectedUnusedPercent = 0 }) {
  num(hourlyRate, "Hourly rate"); num(expiryMonths, "Expiry months");
  if (num(hoursInBlock, "Hours in the block") <= 0) throw new Error("Hours in the block must be more than 0.");
  if (num(discountPercent, "Discount percentage") > 100) throw new Error("Discount percentage must be 100 or less.");
  if (num(expectedUnusedPercent, "Expected unused percentage") > 100) throw new Error("Expected unused percentage must be 100 or less.");
  const listPrice = hoursInBlock * hourlyRate;
  const blockPrice = listPrice * (1 - discountPercent / 100);
  const expectedUsedHours = hoursInBlock * (1 - expectedUnusedPercent / 100);
  return {
    listPrice: round2(listPrice), blockPrice: round2(blockPrice), effectiveRate: round2(blockPrice / hoursInBlock), expectedUsedHours: round2(expectedUsedHours),
    effectiveRateOnUsedHours: expectedUsedHours > 0 ? round2(blockPrice / expectedUsedHours) : null, perMonth: expiryMonths > 0 ? round2(blockPrice / expiryMonths) : null,
  };
}
