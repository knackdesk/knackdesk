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
export function clientHoursCapacity({ caregivers, hoursPerCaregiverWeekly, utilizationPercent = 100, averageClientHoursWeekly, currentClients = 0, billRate = 0 }) {
  positive(caregivers, "Caregivers"); num(hoursPerCaregiverWeekly, "Hours per caregiver per week"); num(utilizationPercent, "Utilization percentage"); positive(averageClientHoursWeekly, "Average client hours per week"); num(currentClients, "Current clients"); num(billRate, "Bill rate");
  if (utilizationPercent > 100) throw new Error("Utilization percentage must be 100 or less.");
  const paidCapacity = caregivers * hoursPerCaregiverWeekly;
  const billableCapacity = paidCapacity * (utilizationPercent / 100);
  const maxClients = Math.floor(billableCapacity / averageClientHoursWeekly + 1e-9);
  const hoursCommitted = currentClients * averageClientHoursWeekly;
  return {
    paidCapacity: round2(paidCapacity), billableCapacity: round2(billableCapacity), maxClients, hoursCommitted: round2(hoursCommitted),
    spareHours: round2(billableCapacity - hoursCommitted), openSlots: maxClients - currentClients,
    weeklyRevenueCeiling: round2(billableCapacity * billRate), currentWeeklyRevenue: round2(hoursCommitted * billRate),
  };
}
