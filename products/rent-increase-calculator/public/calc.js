const round2 = (n) => Math.round(n * 100) / 100;
function nonNeg(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function positive(v, name) {
  if (nonNeg(v, name) === 0) throw new Error(`${name} must be above zero.`);
  return v;
}
const differences = (oldRent, newRent) => {
  const monthly = newRent - oldRent;
  return { monthlyDifference: round2(monthly), yearlyDifference: round2(monthly * 12) };
};

export function applyIncrease({ rent, percent }) {
  nonNeg(rent, "Current rent");
  if (typeof percent !== "number" || !Number.isFinite(percent)) throw new Error("Increase must be a number.");
  if (percent <= -100) throw new Error("Increase must be above -100 percent.");
  const newRent = rent * (1 + percent / 100);
  return { newRent: round2(newRent), ...differences(rent, newRent) };
}

export function percentBetween({ oldRent, newRent }) {
  positive(oldRent, "Old rent");
  nonNeg(newRent, "New rent");
  return { percent: round2(((newRent - oldRent) / oldRent) * 100), ...differences(oldRent, newRent) };
}

// Arithmetic only: the user enters whatever cap applies to them, if any.
export function capCheck({ oldRent, newRent, capPercent }) {
  positive(oldRent, "Old rent");
  nonNeg(newRent, "New rent");
  nonNeg(capPercent, "Cap");
  const maxRentAtCap = round2(oldRent * (1 + capPercent / 100));
  return { percent: round2(((newRent - oldRent) / oldRent) * 100), capPercent, withinCap: round2(newRent) <= maxRentAtCap, maxRentAtCap };
}
