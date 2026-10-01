const round2 = (n) => Math.round(n * 100) / 100;
const MAX_HOURS = 168;

function num(v, name) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${name} must be a number of 0 or more.`);
  return v;
}

function validate({ hoursWorked, thresholdHours, hourlyRate, multiplier, doubleTimeAfter, doubleMultiplier }) {
  if (num(hoursWorked, "Hours worked") > MAX_HOURS) throw new Error(`Hours worked cannot exceed ${MAX_HOURS} (the hours in a week).`);
  num(thresholdHours, "Overtime threshold");
  num(hourlyRate, "Hourly rate");
  if (num(multiplier, "Overtime multiplier") < 1) throw new Error("Overtime multiplier must be 1 or more.");
  if (doubleTimeAfter !== null) {
    if (num(doubleTimeAfter, "Double time threshold") <= thresholdHours) throw new Error("Double time threshold must be above the overtime threshold.");
    if (num(doubleMultiplier, "Double time multiplier") < 1) throw new Error("Double time multiplier must be 1 or more.");
  }
}

export function overtime({ hoursWorked, thresholdHours = 40, hourlyRate, multiplier = 1.5, doubleTimeAfter = null, doubleMultiplier = 2 }) {
  validate({ hoursWorked, thresholdHours, hourlyRate, multiplier, doubleTimeAfter, doubleMultiplier });
  const regularHours = Math.min(hoursWorked, thresholdHours);
  let overtimeHours = Math.max(0, hoursWorked - thresholdHours);
  let doubleHours = 0;
  if (doubleTimeAfter !== null && hoursWorked > doubleTimeAfter) {
    doubleHours = hoursWorked - doubleTimeAfter;
    overtimeHours = Math.max(0, doubleTimeAfter - thresholdHours);
  }
  const regularPay = round2(regularHours * hourlyRate);
  const overtimePay = round2(overtimeHours * hourlyRate * multiplier);
  const doublePay = round2(doubleHours * hourlyRate * doubleMultiplier);
  const total = round2(regularPay + overtimePay + doublePay);
  return {
    regularHours: round2(regularHours), overtimeHours: round2(overtimeHours), doubleHours: round2(doubleHours),
    regularPay, overtimePay, doublePay, total,
    effectiveRate: hoursWorked === 0 ? 0 : round2(total / hoursWorked),
  };
}
