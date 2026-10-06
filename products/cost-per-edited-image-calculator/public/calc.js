const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function costPerImage({ shootHours, editingHours, hourlyRate, imagesDelivered, markupPercent = 0 }) {
  num(shootHours, "Shoot hours"); num(editingHours, "Editing hours"); num(hourlyRate, "Hourly rate"); num(markupPercent, "Markup");
  if (num(imagesDelivered, "Images delivered") <= 0) throw new Error("Images delivered must be more than 0.");
  const totalHours = shootHours + editingHours;
  const totalCost = totalHours * hourlyRate;
  const perImage = totalCost / imagesDelivered;
  return { totalHours: round2(totalHours), totalCost: round2(totalCost), costPerImage: round2(perImage), extraImagePrice: round2(perImage * (1 + markupPercent / 100)), minutesPerImage: round2((totalHours * 60) / imagesDelivered) };
}
