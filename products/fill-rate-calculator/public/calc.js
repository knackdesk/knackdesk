const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
function positive(v, name) {
  num(v, name);
  if (v === 0) throw new Error(`${name} must be more than 0.`);
  return v;
}
export function fillRate({ jobOrdersReceived, jobOrdersFilled, totalDaysToFill = 0, candidatesSubmitted = 0, interviews = 0 }) {
  positive(jobOrdersReceived, "Job orders received"); num(jobOrdersFilled, "Job orders filled"); num(totalDaysToFill, "Total days to fill"); num(candidatesSubmitted, "Candidates submitted"); num(interviews, "Interviews");
  if (jobOrdersFilled > jobOrdersReceived) throw new Error("Job orders filled cannot be more than job orders received.");
  return {
    fillRatePercent: round2((jobOrdersFilled / jobOrdersReceived) * 100), unfilledOrders: round2(jobOrdersReceived - jobOrdersFilled),
    averageDaysToFill: jobOrdersFilled > 0 ? round2(totalDaysToFill / jobOrdersFilled) : null,
    submittalsPerFill: jobOrdersFilled > 0 ? round2(candidatesSubmitted / jobOrdersFilled) : null,
    submittalToInterviewPercent: candidatesSubmitted > 0 ? round2((interviews / candidatesSubmitted) * 100) : null,
    interviewToFillPercent: interviews > 0 ? round2((jobOrdersFilled / interviews) * 100) : null,
  };
}
