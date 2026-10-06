const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function costPerTicket({ ticketsPerMonth, technicianCostMonthly, toolCostMonthly = 0, overheadMonthly = 0, technicians = 0, averageMinutesPerTicket = 0 }) {
  num(technicianCostMonthly, "Technician cost"); num(toolCostMonthly, "Tool cost"); num(overheadMonthly, "Overhead"); num(technicians, "Technicians"); num(averageMinutesPerTicket, "Minutes per ticket");
  if (num(ticketsPerMonth, "Tickets per month") <= 0) throw new Error("Tickets per month must be more than 0.");
  const totalCost = technicianCostMonthly + toolCostMonthly + overheadMonthly;
  return {
    totalCost: round2(totalCost), costPerTicket: round2(totalCost / ticketsPerMonth), labourCostPerTicket: round2(technicianCostMonthly / ticketsPerMonth),
    ticketsPerTechnician: technicians > 0 ? round2(ticketsPerMonth / technicians) : null, labourHoursOnTickets: round2((ticketsPerMonth * averageMinutesPerTicket) / 60),
  };
}
