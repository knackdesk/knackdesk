const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function pct(v, name) {
  num(v, name);
  if (v > 100) throw new Error(`${name} must be 100 or less.`);
  return v;
}
export function guaranteeRebateReserve({ placementFee, guaranteeDays = 90, expectedFallOffPercent, rebatePercent = 100, placementsPerYear = 1 }) {
  num(placementFee, "Placement fee"); num(guaranteeDays, "Guarantee days"); pct(expectedFallOffPercent, "Expected fall-off rate"); pct(rebatePercent, "Rebate percentage"); num(placementsPerYear, "Placements per year");
  const expectedRebatePerPlacement = placementFee * (rebatePercent / 100) * (expectedFallOffPercent / 100);
  const netExpectedFee = placementFee - expectedRebatePerPlacement;
  return {
    expectedRebatePerPlacement: round2(expectedRebatePerPlacement), netExpectedFee: round2(netExpectedFee),
    reservePercentOfFee: round2((rebatePercent * expectedFallOffPercent) / 100),
    annualReserve: round2(expectedRebatePerPlacement * placementsPerYear), annualNetFees: round2(netExpectedFee * placementsPerYear),
    guaranteeDays,
  };
}
