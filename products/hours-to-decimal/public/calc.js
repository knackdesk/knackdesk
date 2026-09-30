const round2 = (n) => Math.round(n * 100) / 100;

export function toMinutes(text) {
  const s = String(text).trim().toLowerCase().replace(",", ".");
  if (s === "") throw new Error("Enter a time.");
  let m;
  if ((m = s.match(/^(\d+):(\d{1,2})$/))) {
    if (Number(m[2]) > 59) throw new Error(`Minutes must be 0 to 59 in "${text}".`);
    return Number(m[1]) * 60 + Number(m[2]);
  }
  if ((m = s.match(/^(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hour|hours)(?:\s*(\d+)\s*(?:m|min|mins|minute|minutes)?)?$/))) {
    return Math.round(Number(m[1]) * 60) + Number(m[2] || 0);
  }
  if ((m = s.match(/^(\d+)\s*(?:m|min|mins|minute|minutes)$/))) return Number(m[1]);
  if ((m = s.match(/^(\d+(?:\.\d+)?)$/))) return Math.round(Number(m[1]) * 60);
  throw new Error(`Unrecognised time format: "${text}". Use h:mm like 1:30, or 2h 15m, or 90m.`);
}

export function toDecimal(text) {
  return round2(toMinutes(text) / 60);
}

export function toHoursMinutes(decimal) {
  if (typeof decimal !== "number" || !Number.isFinite(decimal) || decimal < 0) throw new Error("Decimal hours must be a number of 0 or more.");
  return minutesToHm(Math.round(decimal * 60));
}

function minutesToHm(totalMinutes) {
  return `${Math.floor(totalMinutes / 60)}:${String(totalMinutes % 60).padStart(2, "0")}`;
}

export function sumEntries(text, rate = 0) {
  const lines = String(text).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const totalMinutes = lines.map(toMinutes).reduce((a, b) => a + b, 0);
  const totalDecimal = round2(totalMinutes / 60);
  return { count: lines.length, totalMinutes, totalDecimal, totalHm: minutesToHm(totalMinutes), amount: round2((totalMinutes / 60) * rate) };
}
