const disaggregateVolume = totalVolume => {
  const result = [
    { dayOfWeek: 1, volume: 0 },
    { dayOfWeek: 2, volume: 0 },
    { dayOfWeek: 3, volume: 0 },
    { dayOfWeek: 4, volume: 0 },
    { dayOfWeek: 5, volume: 0 },
    { dayOfWeek: 6, volume: 0 },
    { dayOfWeek: 7, volume: 0 }
  ];

  const quotient = Math.floor(totalVolume / 7);
  let remainder = totalVolume % 7;

  return result.map(dayOfWeek => {
    dayOfWeek.volume = remainder > 0 ? quotient + 1 : quotient;
    remainder -= 1;
    return dayOfWeek;
  });
};

const calculateTotalVolume = (baseline, uplift, method) => {
  if (method === "absolute") {
    if (
      Number.isInteger(uplift) &&
      Math.sign(uplift) !== -1 &&
      Number.isInteger(baseline) &&
      Math.sign(baseline) !== -1
    ) {
      return baseline + uplift;
    } else {
      throw new Error(
        "Baseline and Absolute Uplift can only be 0 or positive integer"
      );
    }
  } else if (method === "percentage") {
    if (
      uplift >= 1 &&
      Number.isInteger(baseline) &&
      Math.sign(baseline) !== -1
    ) {
      return Math.round((totalVolume = baseline * uplift));
    } else {
      throw new Error(
        "Baseline can only be 0 or positive integer and Percentage Uplift can only be 1 or larger"
      );
    }
  } else {
    throw new Error(
      "Uplift method can only be either 'absolute' or 'percentage'"
    );
  }
};

module.exports = { disaggregateVolume, calculateTotalVolume };
