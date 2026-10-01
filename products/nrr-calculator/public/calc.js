const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function retention({ startMrr, expansion = 0, contraction = 0, churned = 0 }) {
  if (num(startMrr, "Starting MRR") <= 0) throw new Error("Starting MRR must be above zero.");
  num(expansion, "Expansion"); num(contraction, "Contraction"); num(churned, "Churned MRR");
  if (contraction + churned > startMrr) throw new Error("Contraction plus churned MRR cannot exceed the starting MRR.");
  const endMrr = round2(startMrr + expansion - contraction - churned);
  return {
    endMrr,
    nrr: round2((endMrr / startMrr) * 100),
    grr: round2(Math.min(100, ((startMrr - contraction - churned) / startMrr) * 100)),
  };
}
