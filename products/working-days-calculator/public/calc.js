const DAY_MS = 86400000;
const MAX_DAYS = 3650;

export function localIsoDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const formatIso = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => new Date(d.getTime() + n * DAY_MS);
const isWeekend = (d) => d.getUTCDay() === 0 || d.getUTCDay() === 6;

function parseIso(s) {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00Z`);
  return Number.isNaN(d.getTime()) || formatIso(d) !== s ? null : d;
}

function requireDate(s, name) {
  const d = parseIso(s);
  if (!d) throw new Error(`Enter a valid ${name} (YYYY-MM-DD).`);
  return d;
}

function holidaySet(holidays) {
  if (!Array.isArray(holidays)) throw new Error("Holidays must be a list of dates.");
  for (const h of holidays) if (!parseIso(h)) throw new Error(`Holiday "${h}" is not a valid date (YYYY-MM-DD).`);
  return new Set(holidays);
}

export function workingDaysBetween({ start, end, holidays = [], includeEnd = true }) {
  const s = requireDate(start, "start date");
  const e = requireDate(end, "end date");
  if (e < s) throw new Error("End date must be on or after the start date.");
  const off = holidaySet(holidays);
  const calendarDays = Math.round((e - s) / DAY_MS) + (includeEnd ? 1 : 0);
  let workingDays = 0, weekendDays = 0, holidayDays = 0;
  for (let i = 0; i < calendarDays; i += 1) {
    const d = addDays(s, i);
    if (isWeekend(d)) weekendDays += 1;
    else if (off.has(formatIso(d))) holidayDays += 1;
    else workingDays += 1;
  }
  return { workingDays, calendarDays, weekendDays, holidayDays };
}

export function addWorkingDays({ start, days, holidays = [] }) {
  let d = requireDate(start, "start date");
  if (!Number.isInteger(days) || days < 0) throw new Error("Working days must be a whole number, 0 or more.");
  if (days > MAX_DAYS) throw new Error(`Working days must be ${MAX_DAYS} or fewer.`);
  const off = holidaySet(holidays);
  let remaining = days;
  while (remaining > 0) {
    d = addDays(d, 1);
    if (!isWeekend(d) && !off.has(formatIso(d))) remaining -= 1;
  }
  return formatIso(d);
}
