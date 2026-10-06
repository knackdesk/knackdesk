const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function clientCapacity({ hoursPerMonth, adminPercent = 0, hoursPerClient, currentClients = 0, averageFee = 0 }) {
  num(hoursPerMonth, "Hours per month"); num(currentClients, "Current clients"); num(averageFee, "Average monthly fee");
  if (num(hoursPerClient, "Hours per client") <= 0) throw new Error("Hours per client must be more than 0.");
  if (num(adminPercent, "Admin percentage") > 100) throw new Error("Admin percentage must be 100 or less.");
  const billableHours = hoursPerMonth * (1 - adminPercent / 100);
  const maxClients = Math.floor(billableHours / hoursPerClient + 1e-9);
  const hoursUsed = currentClients * hoursPerClient;
  return {
    billableHours: round2(billableHours), maxClients, hoursUsed: round2(hoursUsed), spareHours: round2(billableHours - hoursUsed),
    openSlots: round2(maxClients - currentClients), revenueAtCapacity: round2(maxClients * averageFee), currentRevenue: round2(currentClients * averageFee),
  };
}
