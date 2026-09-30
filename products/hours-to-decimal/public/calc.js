const round2 = (n) => Math.round(n * 100) / 100;

export function toDecimal(text) {
  const s = String(text).trim().toLowerCase();
  let h = 0, m = 0;
  let match;
  if ((match = s.match(/^(\d+):(\d{1,2})$/))) { h = Number(match[1]); m = Number(match[2]); }
  else if ((match = s.match(/^(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?$/)) && s !== "") { h = Number(match[1] || 0); m = Number(match[2] || 0); }
  else if ((match = s.match(/^(\d+(?:\.\d+)?)$/))) { return round2(Number(match[1])); }
  else throw new Error(`Unrecognised time format: "${text}". Use h:mm, like 1:30, or 2h 15m.`);
  if (m > 59) throw new Error(`Minutes must be 0 to 59 in "${text}".`);
  return round2(h + m / 60);
}

export function toHoursMinutes(decimal) {
  if (typeof decimal !== "number" || !Number.isFinite(decimal) || decimal < 0) throw new Error("Decimal hours must be a number of 0 or more.");
  const totalMinutes = Math.round(decimal * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

export function sumEntries(text, rate = 0) {
  const lines = String(text).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const decimals = lines.map(toDecimal);
  const totalDecimal = round2(decimals.reduce((a, b) => a + b, 0));
  return { count: lines.length, totalDecimal, totalHm: toHoursMinutes(totalDecimal), amount: round2(totalDecimal * rate) };
}
