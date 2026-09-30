const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function revenueGoal({ annualGoal, avgProjectValue, projectsPerClient = 1, winRatePercent }) {
  num(annualGoal, "Annual goal");
  if (num(avgProjectValue, "Average project value") <= 0) throw new Error("Average project value must be above zero.");
  if (num(projectsPerClient, "Projects per client") <= 0) throw new Error("Projects per client must be above zero.");
  if (num(winRatePercent, "Win rate") <= 0 || winRatePercent > 100) throw new Error("Win rate must be above 0 and at most 100 percent.");
  const projectsPerYear = Math.ceil(annualGoal / avgProjectValue);
  const clientsPerYear = Math.ceil(projectsPerYear / projectsPerClient);
  const proposalsPerYear = Math.ceil(clientsPerYear / (winRatePercent / 100));
  return {
    projectsPerYear,
    projectsPerMonth: round2(projectsPerYear / 12),
    clientsPerYear,
    clientsPerMonth: round2(clientsPerYear / 12),
    proposalsPerYear,
    proposalsPerMonth: round2(proposalsPerYear / 12),
  };
}
