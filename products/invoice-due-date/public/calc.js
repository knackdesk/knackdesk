const DAY_MS = 86400000;

export function formatIso(d) {
  return d.toISOString().slice(0, 10);
}

export function isWeekend(d) {
  const day = d.getUTCDay();
  return day === 0 || day === 6;
}

export function addDays(d, n) {
  return new Date(d.getTime() + n * DAY_MS);
}

export function addBusinessDays(d, n) {
  let out = new Date(d.getTime());
  let remaining = n;
  while (remaining > 0) {
    out = addDays(out, 1);
    if (!isWeekend(out)) remaining -= 1;
  }
  return out;
}

function parseIso(s) {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00Z`);
  return Number.isNaN(d.getTime()) || formatIso(d) !== s ? null : d;
}

export function dueDate({ issueDate, termDays, mode = "calendar", rollForward = false, today = new Date() }) {
  const issue = parseIso(issueDate);
  if (!issue) throw new Error("Enter a valid issue date (YYYY-MM-DD).");
  if (!Number.isInteger(termDays) || termDays < 0) throw new Error("Payment term must be a whole number of days, 0 or more.");
  let due = mode === "business" ? addBusinessDays(issue, termDays) : addDays(issue, termDays);
  if (rollForward) while (isWeekend(due)) due = addDays(due, 1);
  const todayUtc = parseIso(formatIso(today));
  const daysFromToday = Math.round((due.getTime() - todayUtc.getTime()) / DAY_MS);
  return { due: formatIso(due), daysFromToday, weekday: due.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }) };
}
