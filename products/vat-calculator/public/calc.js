const round2 = (n) => Math.round(n * 100) / 100;

function check(amount, ratePercent) {
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) throw new Error("Amount must be a number of 0 or more.");
  if (typeof ratePercent !== "number" || !Number.isFinite(ratePercent) || ratePercent < 0) throw new Error("VAT rate must be a number of 0 or more.");
}

export function addVat({ net, ratePercent }) {
  check(net, ratePercent);
  const vat = round2(net * (ratePercent / 100));
  return { net: round2(net), vat, gross: round2(net + vat) };
}

export function removeVat({ gross, ratePercent }) {
  check(gross, ratePercent);
  const net = round2(gross / (1 + ratePercent / 100));
  return { net, vat: round2(gross - net), gross: round2(gross) };
}
