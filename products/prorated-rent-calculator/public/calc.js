const round2 = (n) => Math.round(n * 100) / 100;
const MODES = ["move-in", "move-out"];
const BASES = ["actual", "30"];

export function localIsoDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseIso(s) {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00Z`);
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s ? null : d;
}

const actualDaysInMonth = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();

// Days charged always come from the real calendar: a move-in on the 31st is one day,
// even when the daily rate uses a 30-day month.
export function proratedRent({ monthlyRent, date, mode, basis = "actual" }) {
  if (typeof monthlyRent !== "number" || !Number.isFinite(monthlyRent) || monthlyRent < 0) throw new Error("Monthly rent must be a number of 0 or more.");
  const d = parseIso(date);
  if (!d) throw new Error("Enter a valid date (YYYY-MM-DD).");
  if (!MODES.includes(mode)) throw new Error("Mode must be move-in or move-out.");
  if (!BASES.includes(basis)) throw new Error("Day-count basis must be actual days or 30 days.");
  const actual = actualDaysInMonth(d);
  const day = d.getUTCDate();
  const daysInMonth = basis === "30" ? 30 : actual;
  const daysCharged = mode === "move-in" ? actual - day + 1 : day;
  const rate = monthlyRent / daysInMonth;
  return { daysInMonth, daysCharged, dailyRate: round2(rate), prorated: round2(rate * daysCharged) };
}
