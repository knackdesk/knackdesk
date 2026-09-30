const round2 = (n) => Math.round(n * 100) / 100;
const DAY_MS = 86400000;

function parseIso(s) {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}
const iso = (d) => d.toISOString().slice(0, 10);

export function splitPayments({ total, depositPercent, milestones, startDate, weeks }) {
  if (typeof total !== "number" || !(total > 0)) throw new Error("Project total must be above zero.");
  if (typeof depositPercent !== "number" || depositPercent < 0 || depositPercent > 100) throw new Error("Deposit percent must be between 0 and 100.");
  if (!Number.isInteger(milestones) || milestones < 1) throw new Error("Milestones must be a whole number of 1 or more.");
  const start = parseIso(startDate);
  if (!start) throw new Error("Enter a valid start date (YYYY-MM-DD).");
  if (typeof weeks !== "number" || !(weeks > 0)) throw new Error("Project length must be above zero weeks.");

  const deposit = round2(total * (depositPercent / 100));
  const remaining = round2(total - deposit);
  const each = Math.floor((remaining / milestones) * 100) / 100;
  const payments = [];
  if (deposit > 0) payments.push({ label: "Deposit", amount: deposit, due: iso(start) });
  const stepDays = (weeks * 7) / milestones;
  let paid = 0;
  for (let i = 1; i <= milestones; i++) {
    const amount = i === milestones ? round2(remaining - paid) : each;
    paid = round2(paid + amount);
    payments.push({ label: `Milestone ${i}`, amount, due: iso(new Date(start.getTime() + Math.round(stepDays * i) * DAY_MS)) });
  }
  return { deposit, remaining, payments };
}
