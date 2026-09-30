const round2 = (n) => Math.round(n * 100) / 100;

function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}

export function earlyPayment({ amount, discountPercent, discountDays, netDays }) {
  num(amount, "Invoice amount");
  if (num(discountPercent, "Discount percent") >= 100) throw new Error("Discount percent must be below 100.");
  num(discountDays, "Discount days");
  if (num(netDays, "Net days") <= discountDays) throw new Error("Net days must be later than the discount days.");
  const saving = round2(amount * (discountPercent / 100));
  const daysGained = netDays - discountDays;
  const d = discountPercent / 100;
  const annualRate = round2((d / (1 - d)) * (365 / daysGained) * 100);
  return { saving, payEarly: round2(amount - saving), daysGained, annualRate };
}
