const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function costPerNewPatient({ marketingSpend, newPatients, firstYearValue = 0, retentionPercent = 100, yearsRetained = 1 }) {
  num(marketingSpend, "Marketing spend"); num(newPatients, "New patients"); num(firstYearValue, "First-year value"); num(retentionPercent, "Retention percentage"); num(yearsRetained, "Years retained");
  if (newPatients === 0) throw new Error("New patients must be more than 0.");
  if (retentionPercent > 100) throw new Error("Retention percentage must be between 0 and 100.");
  if (yearsRetained < 1) throw new Error("Years retained must be 1 or more.");
  const cost = marketingSpend / newPatients;
  const lifetimeValue = firstYearValue + firstYearValue * (retentionPercent / 100) * (yearsRetained - 1);
  return {
    costPerNewPatient: round2(cost), lifetimeValue: round2(lifetimeValue),
    valueToCostRatio: cost > 0 ? round2(lifetimeValue / cost) : null,
    netValuePerPatient: round2(lifetimeValue - cost),
    breakEvenNewPatients: firstYearValue > 0 ? round2(marketingSpend / firstYearValue) : null,
  };
}
