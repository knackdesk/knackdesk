const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function dayRate({ incomeGoal, businessCosts = 0, shootDaysPerYear, hoursPerShootDay = 8, editingHoursPerShootDay = 0 }) {
  num(incomeGoal, "Income goal"); num(businessCosts, "Business costs");
  if (num(shootDaysPerYear, "Shoot days per year") <= 0) throw new Error("Shoot days per year must be more than 0.");
  num(hoursPerShootDay, "Hours per shoot day"); num(editingHoursPerShootDay, "Editing hours per shoot day");
  const hoursPerBooking = hoursPerShootDay + editingHoursPerShootDay;
  if (hoursPerBooking <= 0) throw new Error("Hours per booking (shoot plus editing) must be more than 0.");
  const revenueNeeded = incomeGoal + businessCosts;
  const rate = revenueNeeded / shootDaysPerYear;
  return { revenueNeeded: round2(revenueNeeded), dayRate: round2(rate), hoursPerBooking: round2(hoursPerBooking), effectiveHourly: round2(rate / hoursPerBooking), halfDayRate: round2(rate * 0.6) };
}
