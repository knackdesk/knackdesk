const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function appointmentCapacity({ hoursPerWeek, serviceMinutes, bufferMinutes = 0, utilizationPercent = 100, averageTicket = 0 }) {
  num(hoursPerWeek, "Hours available per week"); num(serviceMinutes, "Service minutes"); num(bufferMinutes, "Buffer minutes"); num(averageTicket, "Average ticket");
  if (num(utilizationPercent, "Utilization percentage") > 100) throw new Error("Utilization percentage must be 100 or less.");
  const slot = serviceMinutes + bufferMinutes;
  if (slot <= 0) throw new Error("Service minutes plus buffer minutes must be more than 0.");
  const max = Math.floor((hoursPerWeek * 60) / slot + 1e-9);
  const expected = (max * utilizationPercent) / 100;
  return { slotMinutes: round2(slot), maxAppointmentsPerWeek: max, expectedAppointmentsPerWeek: round2(expected), maxRevenuePerWeek: round2(max * averageTicket), expectedRevenuePerWeek: round2(expected * averageTicket) };
}
