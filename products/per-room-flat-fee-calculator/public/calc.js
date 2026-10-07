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
export function perRoomFlatFee({ rooms, hoursPerRoom, hourlyRate, complexityUpliftPercent = 0, siteVisitHours = 0, minimumFee = 0 }) {
  num(rooms, "Rooms"); num(hoursPerRoom, "Hours per room"); num(hourlyRate, "Hourly rate"); num(complexityUpliftPercent, "Complexity uplift percentage"); num(siteVisitHours, "Site visit hours"); num(minimumFee, "Minimum fee");
  positive(rooms, "Rooms"); positive(hourlyRate, "Hourly rate");
  const baseHours = rooms * hoursPerRoom;
  const hoursWithUplift = baseHours * (1 + complexityUpliftPercent / 100);
  const totalHours = hoursWithUplift + siteVisitHours;
  const computedFee = totalHours * hourlyRate;
  const flatFee = Math.max(computedFee, minimumFee);
  return {
    totalHours: round2(totalHours), computedFee: round2(computedFee), flatFee: round2(flatFee),
    minimumApplied: minimumFee > computedFee, feePerRoom: round2(flatFee / rooms),
  };
}
