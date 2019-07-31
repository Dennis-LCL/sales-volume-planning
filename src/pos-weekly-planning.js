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

const calculateTotalVolume = (baselineVolume, uplift) => {
  return (totalVolume = baselineVolume * uplift);
};

module.exports = { disaggregateVolume, calculateTotalVolume };
