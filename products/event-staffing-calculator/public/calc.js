const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function eventStaffing({ guests, guestsPerServer, eventHours, setupHours = 0, minimumHours = 0, hourlyRate }) {
  if (num(guests, "Guests") <= 0) throw new Error("Guests must be more than 0.");
  if (num(guestsPerServer, "Guests per server") <= 0) throw new Error("Guests per server must be more than 0.");
  num(eventHours, "Event hours"); num(setupHours, "Setup and breakdown hours"); num(minimumHours, "Minimum paid hours"); num(hourlyRate, "Hourly rate");
  const servers = Math.ceil(guests / guestsPerServer);
  const hoursPerServer = round2(Math.max(eventHours + setupHours, minimumHours));
  const totalHours = round2(servers * hoursPerServer);
  const laborCost = round2(totalHours * hourlyRate);
  return { servers, hoursPerServer, totalHours, laborCost, costPerGuest: round2(laborCost / guests) };
}
