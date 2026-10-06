const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
const MIX_TOLERANCE = 0.01;
export function barCost({ guests, hours, drinksFirstHour = 2, drinksPerLaterHour = 1, beerPercent, winePercent, spiritsPercent, beerCost, wineCost, spiritsCost, guestsPerBartender = 50 }) {
  if (num(guests, "Guests") <= 0) throw new Error("Guests must be more than 0.");
  if (num(hours, "Hours") < 1) throw new Error("Hours must be at least 1.");
  num(drinksFirstHour, "Drinks in the first hour"); num(drinksPerLaterHour, "Drinks per later hour");
  num(beerPercent, "Beer share"); num(winePercent, "Wine share"); num(spiritsPercent, "Spirits share");
  num(beerCost, "Beer cost per drink"); num(wineCost, "Wine cost per drink"); num(spiritsCost, "Spirits cost per drink");
  if (num(guestsPerBartender, "Guests per bartender") <= 0) throw new Error("Guests per bartender must be more than 0.");
  if (Math.abs(beerPercent + winePercent + spiritsPercent - 100) > MIX_TOLERANCE) throw new Error("Beer, wine and spirits shares must add up to 100.");
  const totalDrinks = round2(guests * (drinksFirstHour + drinksPerLaterHour * (hours - 1)));
  const beerDrinks = round2(totalDrinks * beerPercent / 100);
  const wineDrinks = round2(totalDrinks * winePercent / 100);
  const spiritsDrinks = round2(totalDrinks * spiritsPercent / 100);
  const beer = round2(beerDrinks * beerCost);
  const wine = round2(wineDrinks * wineCost);
  const spirits = round2(spiritsDrinks * spiritsCost);
  const totalCost = round2(beer + wine + spirits);
  return { totalDrinks, beerDrinks, wineDrinks, spiritsDrinks, beerCost: beer, wineCost: wine, spiritsCost: spirits, totalCost, costPerGuest: round2(totalCost / guests), bartenders: Math.ceil(guests / guestsPerBartender) };
}
