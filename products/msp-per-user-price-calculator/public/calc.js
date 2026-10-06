const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function mspPerUserPrice({ users, toolCostPerUserMonthly = 0, fixedToolCostMonthly = 0, supportHoursPerUserMonthly, loadedHourlyCost, marginPercent = 0 }) {
  num(toolCostPerUserMonthly, "Tool cost per user"); num(fixedToolCostMonthly, "Fixed tool cost"); num(supportHoursPerUserMonthly, "Support hours per user"); num(loadedHourlyCost, "Loaded hourly cost");
  if (num(users, "Users") <= 0) throw new Error("Users must be more than 0.");
  if (num(marginPercent, "Margin percentage") >= 100) throw new Error("Margin percentage must be less than 100.");
  const toolCostPerUser = toolCostPerUserMonthly + fixedToolCostMonthly / users;
  const labourCostPerUser = supportHoursPerUserMonthly * loadedHourlyCost;
  const costPerUser = toolCostPerUser + labourCostPerUser;
  const pricePerUser = costPerUser / (1 - marginPercent / 100);
  return {
    toolCostPerUser: round2(toolCostPerUser), labourCostPerUser: round2(labourCostPerUser), costPerUser: round2(costPerUser), pricePerUser: round2(pricePerUser),
    monthlyRevenue: round2(pricePerUser * users), monthlyProfit: round2((pricePerUser - costPerUser) * users),
  };
}
