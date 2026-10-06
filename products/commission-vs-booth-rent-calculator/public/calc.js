const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function commissionVsBoothRent({ monthlyRevenue, commissionPercent, weeklyBoothRent, productCostPercent = 0 }) {
  num(monthlyRevenue, "Monthly revenue"); num(weeklyBoothRent, "Weekly booth rent");
  if (num(commissionPercent, "Commission percentage") > 100) throw new Error("Commission percentage must be 100 or less.");
  if (num(productCostPercent, "Product cost percentage") > 100) throw new Error("Product cost percentage must be 100 or less.");
  const rentMonthly = (weeklyBoothRent * 52) / 12;
  const commissionTakeHome = (monthlyRevenue * commissionPercent) / 100;
  const boothTakeHome = monthlyRevenue - rentMonthly - (monthlyRevenue * productCostPercent) / 100;
  const keptShare = (100 - commissionPercent - productCostPercent) / 100;
  return {
    commissionTakeHome: round2(commissionTakeHome),
    boothRentMonthly: round2(rentMonthly),
    boothTakeHome: round2(boothTakeHome),
    difference: round2(boothTakeHome - commissionTakeHome),
    breakEvenRevenue: keptShare > 0 ? round2(rentMonthly / keptShare) : null,
  };
}
