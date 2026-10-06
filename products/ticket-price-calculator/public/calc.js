const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function ticketPrice({ fixedCosts, variableCostPerAttendee = 0, attendees, targetProfit = 0, feePercent = 0 }) {
  num(fixedCosts, "Fixed costs"); num(variableCostPerAttendee, "Cost per attendee"); num(targetProfit, "Target profit");
  if (num(attendees, "Attendees") <= 0) throw new Error("Attendees must be more than 0.");
  if (num(feePercent, "Ticketing fee") >= 100) throw new Error("Ticketing fee must be below 100 percent.");
  const totalCost = round2(fixedCosts + variableCostPerAttendee * attendees);
  const factor = 1 - feePercent / 100;
  const breakEvenPrice = round2(totalCost / (attendees * factor));
  const targetPrice = round2((totalCost + targetProfit) / (attendees * factor));
  const revenueAtTarget = round2(targetPrice * attendees);
  return { totalCost, breakEvenPrice, targetPrice, revenueAtTarget, feesAtTarget: round2(revenueAtTarget * feePercent / 100) };
}
