const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function turnoverCost({ annualCost, workingDays = 240, recruitingCost = 0, vacantDays = 0, onboardingCost = 0, rampDays = 0, rampProductivityPercent = 50, headcount = 1, turnoverRatePercent = 0 }) {
  num(annualCost, "Annual employee cost");
  if (num(workingDays, "Working days") <= 0) throw new Error("Working days per year must be above zero.");
  num(recruitingCost, "Recruiting cost"); num(vacantDays, "Vacant days"); num(onboardingCost, "Onboarding cost"); num(rampDays, "Ramp-up days");
  if (num(rampProductivityPercent, "Ramp-up productivity") > 100) throw new Error("Ramp-up productivity cannot exceed 100 percent.");
  num(headcount, "Headcount");
  if (num(turnoverRatePercent, "Turnover rate") > 100) throw new Error("Turnover rate cannot exceed 100 percent.");
  const dailyCost = round2(annualCost / workingDays);
  const vacancyCost = round2(dailyCost * vacantDays);
  const rampCost = round2(dailyCost * rampDays * (1 - rampProductivityPercent / 100));
  const perLeaver = round2(recruitingCost + vacancyCost + onboardingCost + rampCost);
  const leaversPerYear = round2(headcount * (turnoverRatePercent / 100));
  return { dailyCost, vacancyCost, rampCost, perLeaver, leaversPerYear, perYear: round2(perLeaver * leaversPerYear), percentOfSalary: annualCost > 0 ? round2((perLeaver / annualCost) * 100) : 0 };
}
