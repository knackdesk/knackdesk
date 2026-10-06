const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function tableTurnover({ seats, hoursOpen, averageDiningMinutes, occupancyPercent = 100, averageCheck = 0 }) {
  num(seats, "Seats"); num(hoursOpen, "Hours open"); num(averageCheck, "Average check");
  if (num(averageDiningMinutes, "Average dining minutes") <= 0) throw new Error("Average dining minutes must be more than 0.");
  if (num(occupancyPercent, "Occupancy percentage") > 100) throw new Error("Occupancy percentage must be 100 or less.");
  const turns = (hoursOpen * 60) / averageDiningMinutes;
  const covers = seats * turns * (occupancyPercent / 100);
  return { turnsPerSeat: round2(turns), coversPerDay: round2(covers), revenuePerDay: round2(covers * averageCheck) };
}
