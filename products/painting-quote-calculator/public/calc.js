const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function paintingQuote({ area, coats = 1, coveragePerUnit, pricePerUnit = 0, prepHours = 0, areaPerHour, hourlyRate = 0, markupPercent = 0 }) {
  num(area, "Area"); num(pricePerUnit, "Paint price"); num(prepHours, "Preparation hours"); num(hourlyRate, "Hourly rate"); num(markupPercent, "Markup");
  if (num(coats, "Coats") < 1) throw new Error("Coats must be at least 1.");
  if (num(coveragePerUnit, "Coverage") <= 0) throw new Error("Coverage per unit of paint must be above zero.");
  if (num(areaPerHour, "Area per hour") <= 0) throw new Error("Area painted per hour must be above zero.");
  const paintedArea = round2(area * coats);
  const paintUnits = Math.ceil(paintedArea / coveragePerUnit - 1e-9);
  const paintCost = round2(paintUnits * pricePerUnit);
  const hours = round2(prepHours + paintedArea / areaPerHour);
  const laborCost = round2(hours * hourlyRate);
  const subtotal = round2(paintCost + laborCost);
  const quote = round2(subtotal * (1 + markupPercent / 100));
  return { paintedArea, paintUnits, paintCost, hours, laborCost, subtotal, quote, pricePerArea: area > 0 ? round2(quote / area) : null };
}
