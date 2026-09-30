const round2 = (n) => Math.round(n * 100) / 100;

function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}

export function lateFee({ amount, daysLate, type, flatFee = 0, ratePercent = 0 }) {
  num(amount, "Invoice amount");
  num(daysLate, "Days late");
  let fee = 0;
  if (type === "flat") {
    fee = daysLate > 0 ? num(flatFee, "Flat fee") : 0;
  } else if (type === "monthly") {
    fee = amount * (num(ratePercent, "Rate") / 100) * (daysLate / 30);
  } else if (type === "annual") {
    fee = amount * (num(ratePercent, "Rate") / 100) * (daysLate / 365);
  } else {
    throw new Error("Fee type must be flat, monthly or annual.");
  }
  fee = round2(fee);
  return { fee, total: round2(amount + fee), perDay: daysLate > 0 && type !== "flat" ? round2(fee / daysLate) : 0 };
}
