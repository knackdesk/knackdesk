const round2 = (n) => Math.round(n * 100) / 100;

function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}

export function localIsoDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseIso(s) {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00Z`);
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s ? null : d;
}

function monthLabel(d, addMonths) {
  const m = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + addMonths, 1));
  return `${m.getUTCFullYear()}-${String(m.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function runway({ cash, monthlyIncome, monthlyCosts, targetMonths, today = new Date() }) {
  num(cash, "Cash on hand");
  num(monthlyIncome, "Monthly income");
  num(monthlyCosts, "Monthly costs");
  const hasTarget = targetMonths !== undefined && targetMonths !== null;
  if (hasTarget && (typeof targetMonths !== "number" || !Number.isFinite(targetMonths) || targetMonths <= 0)) {
    throw new Error("Target runway must be more than 0 months.");
  }
  const start = parseIso(typeof today === "string" ? today : localIsoDate(today));
  if (!start) throw new Error("Today's date is invalid (use YYYY-MM-DD).");
  const burn = round2(monthlyCosts - monthlyIncome);
  if (burn <= 0) return { burn, months: null, runOutDate: null, costsForTarget: null, cutNeeded: null };
  const months = round2(cash / burn);
  const runOutDate = monthLabel(start, Math.floor(months));
  if (!hasTarget || targetMonths <= months) return { burn, months, runOutDate, costsForTarget: null, cutNeeded: null };
  const costsForTarget = round2(monthlyIncome + cash / targetMonths);
  return { burn, months, runOutDate, costsForTarget, cutNeeded: round2(monthlyCosts - costsForTarget) };
}
