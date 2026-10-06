const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function clientOnboardingFee({ onboardingHours, hourlyRate, setupCosts = 0, marginOnCostsPercent = 0, contractMonths = 0, monthlyFee = 0 }) {
  num(onboardingHours, "Onboarding hours"); num(hourlyRate, "Hourly rate"); num(setupCosts, "Setup costs"); num(marginOnCostsPercent, "Margin on costs"); num(contractMonths, "Contract months"); num(monthlyFee, "Monthly fee");
  const labour = onboardingHours * hourlyRate;
  const costsWithMargin = setupCosts * (1 + marginOnCostsPercent / 100);
  const onboardingFee = labour + costsWithMargin;
  const contractValue = onboardingFee + monthlyFee * contractMonths;
  return {
    labour: round2(labour), costsWithMargin: round2(costsWithMargin), onboardingFee: round2(onboardingFee),
    amortisedPerMonth: contractMonths > 0 ? round2(onboardingFee / contractMonths) : null, contractValue: round2(contractValue),
    feeShareOfContractPercent: contractValue > 0 ? round2((onboardingFee / contractValue) * 100) : 0,
  };
}
