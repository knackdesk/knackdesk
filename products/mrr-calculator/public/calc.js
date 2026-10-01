const round2 = (n) => Math.round(n * 100) / 100;
const MONTHS = { month: 1, quarter: 3, year: 12 };
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function mrr({ plans }) {
  if (!Array.isArray(plans) || plans.length === 0) throw new Error("Enter at least one plan.");
  const rows = plans.map((p, i) => {
    const label = p.name || `Plan ${i + 1}`;
    if (!MONTHS[p.period]) throw new Error(`${label}: period must be month, quarter or year.`);
    num(p.price, `${label}: price`);
    if (!Number.isInteger(p.customers) || p.customers < 0) throw new Error(`${label}: customers must be a whole number of 0 or more.`);
    return { name: label, mrr: round2((p.price * p.customers) / MONTHS[p.period]), customers: p.customers };
  });
  const total = round2(rows.reduce((s, r) => s + r.mrr, 0));
  const customers = rows.reduce((s, r) => s + r.customers, 0);
  return { plans: rows, mrr: total, arr: round2(total * 12), customers, arpa: customers > 0 ? round2(total / customers) : 0 };
}
export function project({ mrr: start, growthPercent, months }) {
  num(start, "MRR");
  if (typeof growthPercent !== "number" || !Number.isFinite(growthPercent)) throw new Error("Growth must be a number.");
  if (!Number.isInteger(months) || months < 0 || months > 120) throw new Error("Months must be a whole number from 0 to 120.");
  return round2(start * Math.pow(1 + growthPercent / 100, months));
}
