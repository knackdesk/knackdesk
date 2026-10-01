const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function profitSplit({ profit, reservePercent = 0, shares }) {
  num(profit, "Profit");
  if (num(reservePercent, "Reserve") > 100) throw new Error("Reserve cannot exceed 100 percent.");
  if (!Array.isArray(shares) || shares.length === 0) throw new Error("Enter at least one partner share.");
  let total = 0;
  for (const s of shares) total += num(s, "Share");
  if (Math.abs(total - 100) > 0.01) throw new Error(`Shares must add up to 100 (they add up to ${round2(total)}).`);
  const reserve = round2(profit * (reservePercent / 100));
  const distributable = round2(profit - reserve);
  return { reserve, distributable, payouts: shares.map((s) => round2(distributable * (s / 100))) };
}
