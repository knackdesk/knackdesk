const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function revenuePerProducer({ annualCommissionRevenue, producers, supportStaff = 0, producerCompensation = 0, newBusinessRevenue = 0 }) {
  num(annualCommissionRevenue, "Annual commission revenue"); num(producers, "Producers"); num(supportStaff, "Support staff"); num(producerCompensation, "Producer compensation"); num(newBusinessRevenue, "New business revenue");
  if (producers === 0) throw new Error("Producers must be more than 0.");
  if (newBusinessRevenue > annualCommissionRevenue) throw new Error("New business revenue cannot be more than annual commission revenue.");
  const revenue = annualCommissionRevenue;
  return {
    revenuePerProducer: round2(revenue / producers), revenuePerEmployee: round2(revenue / (producers + supportStaff)),
    compensationRatioPercent: revenue > 0 ? round2((producerCompensation / revenue) * 100) : 0,
    newBusinessSharePercent: revenue > 0 ? round2((newBusinessRevenue / revenue) * 100) : 0,
    newBusinessPerProducer: round2(newBusinessRevenue / producers),
  };
}
