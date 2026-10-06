const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function chairUtilization({ chairs, hoursOpenPerDay, daysPerMonth, scheduledHours, productionPerScheduledHour = 0 }) {
  num(chairs, "Chairs"); num(hoursOpenPerDay, "Hours open per day"); num(daysPerMonth, "Days per month"); num(scheduledHours, "Scheduled hours"); num(productionPerScheduledHour, "Production per scheduled hour");
  if (chairs === 0) throw new Error("Chairs must be more than 0.");
  const availableChairHours = chairs * hoursOpenPerDay * daysPerMonth;
  if (availableChairHours === 0) throw new Error("Available chair hours must be more than 0. Enter the hours open per day and the days open per month.");
  if (scheduledHours > availableChairHours) throw new Error("Scheduled hours cannot exceed available chair hours.");
  const currentProduction = scheduledHours * productionPerScheduledHour;
  const productionAtFull = availableChairHours * productionPerScheduledHour;
  return {
    availableChairHours: round2(availableChairHours), utilizationPercent: round2((scheduledHours / availableChairHours) * 100),
    idleHours: round2(availableChairHours - scheduledHours), currentProduction: round2(currentProduction),
    productionAtFull: round2(productionAtFull), unrealisedProduction: round2(productionAtFull - currentProduction),
  };
}
