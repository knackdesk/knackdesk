const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function etsyFees({ salePrice, shippingCharged = 0, listingFee = 0.2, transactionPercent = 6.5, paymentPercent = 3, paymentFixed = 0.25, offsiteAdsPercent = 0, itemCost = 0, shippingCost = 0 }) {
  if (num(salePrice, "Sale price") <= 0) throw new Error("Sale price must be above zero.");
  num(shippingCharged, "Shipping charged"); num(listingFee, "Listing fee"); num(transactionPercent, "Transaction fee"); num(paymentPercent, "Payment processing fee");
  num(paymentFixed, "Payment fixed fee"); num(offsiteAdsPercent, "Offsite ads fee"); num(itemCost, "Item cost"); num(shippingCost, "Shipping cost");
  const revenue = round2(salePrice + shippingCharged);
  const transactionFee = round2(revenue * (transactionPercent / 100));
  const paymentFee = round2(revenue * (paymentPercent / 100) + paymentFixed);
  const offsiteFee = round2(revenue * (offsiteAdsPercent / 100));
  const totalFees = round2(listingFee + transactionFee + paymentFee + offsiteFee);
  const profit = round2(revenue - totalFees - itemCost - shippingCost);
  return { revenue, listingFee: round2(listingFee), transactionFee, paymentFee, offsiteFee, totalFees, feePercent: round2((totalFees / revenue) * 100), profit, margin: round2((profit / revenue) * 100) };
}
