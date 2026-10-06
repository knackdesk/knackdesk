const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function eventBudget({ budget, guests, lines }) {
  num(budget, "Budget");
  if (num(guests, "Guests") <= 0) throw new Error("Guests must be more than 0.");
  if (!Array.isArray(lines) || lines.length === 0) throw new Error("Add at least one budget line.");
  const clean = lines.map((l, i) => ({ name: String(l.name || `Line ${i + 1}`), amount: num(l.amount, `Line ${i + 1} amount`) }));
  const total = round2(clean.reduce((s, l) => s + l.amount, 0));
  const withShares = clean.map((l) => ({ ...l, share: total > 0 ? round2((l.amount / total) * 100) : 0, perGuest: round2(l.amount / guests) }));
  return { total, perGuest: round2(total / guests), remaining: round2(budget - total), lines: withShares };
}
