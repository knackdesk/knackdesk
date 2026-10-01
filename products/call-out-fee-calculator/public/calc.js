const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function callOut({ callOutFee = 0, includedMinutes = 0, hourlyRate = 0, minutesOnSite = 0, incrementMinutes = 15, partsCost = 0, partsMarkupPercent = 0 }) {
  num(callOutFee, "Call-out fee"); num(includedMinutes, "Included minutes"); num(hourlyRate, "Hourly rate"); num(minutesOnSite, "Minutes on site"); num(partsCost, "Parts cost"); num(partsMarkupPercent, "Parts markup");
  if (num(incrementMinutes, "Billing increment") <= 0) throw new Error("Billing increment must be above zero minutes.");
  const extraMinutes = Math.max(0, minutesOnSite - includedMinutes);
  const billedExtraMinutes = extraMinutes === 0 ? 0 : Math.ceil(extraMinutes / incrementMinutes - 1e-9) * incrementMinutes;
  const laborCharge = round2((billedExtraMinutes / 60) * hourlyRate);
  const partsPrice = round2(partsCost * (1 + partsMarkupPercent / 100));
  return { extraMinutes, billedExtraMinutes, laborCharge, partsPrice, partsProfit: round2(partsPrice - partsCost), total: round2(callOutFee + laborCharge + partsPrice) };
}
