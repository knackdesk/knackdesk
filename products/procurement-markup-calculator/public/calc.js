const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function procurementMarkup({ retailPrice, tradeDiscountPercent = 0, markupPercent = 0, clientPrice = 0, freightAndHandling = 0 }) {
  num(retailPrice, "Retail price"); num(tradeDiscountPercent, "Trade discount"); num(markupPercent, "Markup percentage"); num(clientPrice, "Client price"); num(freightAndHandling, "Freight and handling");
  if (tradeDiscountPercent > 100) throw new Error("Trade discount cannot be more than 100 percent.");
  const yourCost = retailPrice * (1 - tradeDiscountPercent / 100);
  const clientPriceUsed = clientPrice > 0 ? clientPrice : yourCost * (1 + markupPercent / 100);
  const grossProfit = clientPriceUsed - yourCost - freightAndHandling;
  return {
    yourCost: round2(yourCost), clientPriceUsed: round2(clientPriceUsed), grossProfit: round2(grossProfit),
    marginPercent: clientPriceUsed > 0 ? round2(grossProfit / clientPriceUsed * 100) : 0,
    savingsVsRetail: round2(retailPrice - clientPriceUsed),
  };
}
