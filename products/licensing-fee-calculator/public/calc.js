const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function licensingFee({ baseFee, durationFactor = 1, territoryFactor = 1, mediaFactor = 1, exclusive = false, exclusivityFactor = 1.5 }) {
  if (num(baseFee, "Base fee") <= 0) throw new Error("Base fee must be more than 0.");
  num(durationFactor, "Duration factor"); num(territoryFactor, "Territory factor"); num(mediaFactor, "Media factor"); num(exclusivityFactor, "Exclusivity factor");
  const appliedExclusivity = exclusive ? exclusivityFactor : 1;
  const fee = baseFee * durationFactor * territoryFactor * mediaFactor * appliedExclusivity;
  return { fee: round2(fee), uplift: round2(fee - baseFee), appliedExclusivity };
}
