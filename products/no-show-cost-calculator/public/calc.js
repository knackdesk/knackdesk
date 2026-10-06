const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function noShowCost({ appointmentsPerWeek, noShowPercent, averageTicket, weeksPerYear = 52, feePerNoShow = 0 }) {
  num(appointmentsPerWeek, "Appointments per week"); num(averageTicket, "Average ticket"); num(weeksPerYear, "Weeks worked per year"); num(feePerNoShow, "No-show fee");
  if (num(noShowPercent, "No-show percentage") > 100) throw new Error("No-show percentage must be 100 or less.");
  const noShows = (appointmentsPerWeek * noShowPercent) / 100;
  const lostPerYear = noShows * averageTicket * weeksPerYear;
  const recovered = noShows * feePerNoShow * weeksPerYear;
  return { noShowsPerWeek: round2(noShows), lostPerWeek: round2(noShows * averageTicket), lostPerYear: round2(lostPerYear), feeRecoveredPerYear: round2(recovered), netLostPerYear: round2(lostPerYear - recovered) };
}
