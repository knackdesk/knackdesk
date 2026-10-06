const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function realizationRate({ hoursWorked, standardRate, amountBilled, amountCollected }) {
  num(amountBilled, "Amount billed"); num(amountCollected, "Amount collected");
  if (num(hoursWorked, "Hours worked") <= 0) throw new Error("Hours worked must be more than 0.");
  if (num(standardRate, "Standard rate") <= 0) throw new Error("Standard rate must be more than 0.");
  if (amountCollected > amountBilled) throw new Error("Amount collected cannot be more than amount billed. Use the billed figure for the same period as the payments.");
  const standardFees = hoursWorked * standardRate;
  return {
    standardFees: round2(standardFees),
    billingRealizationPercent: round2((amountBilled / standardFees) * 100),
    collectionRealizationPercent: amountBilled > 0 ? round2((amountCollected / amountBilled) * 100) : 0,
    overallRealizationPercent: round2((amountCollected / standardFees) * 100),
    writeOffs: round2(standardFees - amountBilled), uncollected: round2(amountBilled - amountCollected), effectiveRate: round2(amountCollected / hoursWorked),
  };
}
