const round2 = (n) => Math.round(n * 100) / 100;
const METHODS = ["equal", "weighted"];
const MIN_PEOPLE = 2;
const MAX_PEOPLE = 6;

function cleanPeople(people, method) {
  if (!Array.isArray(people) || people.length < MIN_PEOPLE || people.length > MAX_PEOPLE) throw new Error(`Enter between ${MIN_PEOPLE} and ${MAX_PEOPLE} people.`);
  return people.map((p, i) => {
    const name = typeof p?.name === "string" && p.name.trim() ? p.name.trim() : `Person ${i + 1}`;
    if (method === "equal") return { name, weight: 1 };
    const w = p?.weight;
    if (typeof w !== "number" || !Number.isFinite(w) || w <= 0) throw new Error(`Weight (room size or income) for ${name} must be above zero.`);
    return { name, weight: w };
  });
}

// Each share is rounded to cents; the last share absorbs the rounding remainder so the shares sum to the total exactly.
export function splitRent({ totalRent, people, method }) {
  if (typeof totalRent !== "number" || !Number.isFinite(totalRent) || totalRent <= 0) throw new Error("Total rent must be above zero.");
  if (!METHODS.includes(method)) throw new Error("Method must be equal or weighted.");
  const list = cleanPeople(people, method);
  const sum = list.reduce((a, p) => a + p.weight, 0);
  const rounded = list.map((p) => round2((totalRent * p.weight) / sum));
  const allButLast = rounded.slice(0, -1).reduce((a, b) => a + b, 0);
  const finalShares = [...rounded.slice(0, -1), round2(totalRent - allButLast)];
  return {
    shares: list.map((p, i) => ({ name: p.name, weight: method === "equal" ? null : p.weight, share: finalShares[i], percent: round2((p.weight / sum) * 100) })),
    total: round2(finalShares.reduce((a, b) => a + b, 0)),
  };
}
