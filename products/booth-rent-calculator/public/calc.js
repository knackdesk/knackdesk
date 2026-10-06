const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function boothRent({ weeklyRent, clientsPerWeek, averageTicket, productCostPercent = 0, weeksPerYear = 52 }) {
  num(weeklyRent, "Weekly rent"); num(clientsPerWeek, "Clients per week"); num(averageTicket, "Average ticket"); num(weeksPerYear, "Weeks worked per year");
  if (num(productCostPercent, "Product cost percentage") > 100) throw new Error("Product cost percentage must be 100 or less.");
  const revenue = clientsPerWeek * averageTicket;
  const keptPerClient = averageTicket * (1 - productCostPercent / 100);
  const net = revenue - weeklyRent - (revenue * productCostPercent) / 100;
  return {
    weeklyRevenue: round2(revenue),
    rentPercentOfRevenue: revenue > 0 ? round2((weeklyRent / revenue) * 100) : 0,
    netPerWeek: round2(net),
    netPerYear: round2(net * weeksPerYear),
    annualRent: round2(weeklyRent * weeksPerYear),
    breakEvenClientsPerWeek: keptPerClient > 0 ? Math.ceil(weeklyRent / keptPerClient - 1e-9) : null,
  };
}
