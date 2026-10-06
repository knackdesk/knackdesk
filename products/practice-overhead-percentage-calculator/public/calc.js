const round2 = (n) => Math.round(n * 100) / 100;
function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}
export function practiceOverheadPercentage({ collections, staffCosts = 0, rentAndFacilities = 0, suppliesAndLab = 0, marketing = 0, otherOverhead = 0, ownerCompensation = 0 }) {
  num(collections, "Collections"); num(staffCosts, "Staff costs"); num(rentAndFacilities, "Rent and facilities"); num(suppliesAndLab, "Supplies and lab"); num(marketing, "Marketing"); num(otherOverhead, "Other overhead"); num(ownerCompensation, "Owner compensation");
  const totalOverhead = staffCosts + rentAndFacilities + suppliesAndLab + marketing + otherOverhead;
  const profitBeforeOwner = collections - totalOverhead;
  return {
    totalOverhead: round2(totalOverhead),
    overheadPercent: collections > 0 ? round2((totalOverhead / collections) * 100) : 0,
    profitBeforeOwner: round2(profitBeforeOwner), profitAfterOwner: round2(profitBeforeOwner - ownerCompensation),
    profitMarginPercent: collections > 0 ? round2((profitBeforeOwner / collections) * 100) : 0,
  };
}
