const round2 = (n) => Math.round(n * 100) / 100;
function nonNeg(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}

// Gross yield uses a full year of rent and ignores costs and vacancy (the usual listing figure).
// Net yield deducts vacancy and yearly running costs.
export function rentalYield({ price, monthlyRent, annualCosts = 0, vacancyWeeks = 0, monthlyMortgage = 0 }) {
  if (nonNeg(price, "Purchase price") === 0) throw new Error("Purchase price must be above zero.");
  nonNeg(monthlyRent, "Monthly rent");
  nonNeg(annualCosts, "Yearly costs");
  nonNeg(monthlyMortgage, "Monthly mortgage payment");
  if (nonNeg(vacancyWeeks, "Vacancy") > 52) throw new Error("Vacancy must be between 0 and 52 weeks.");
  const fullYearRent = monthlyRent * 12;
  const annualRent = fullYearRent * (1 - vacancyWeeks / 52);
  const netIncome = annualRent - annualCosts;
  return {
    grossYield: round2((fullYearRent / price) * 100),
    annualRent: round2(annualRent),
    netIncome: round2(netIncome),
    netYield: round2((netIncome / price) * 100),
    monthlyCashFlow: round2(netIncome / 12 - monthlyMortgage),
  };
}
