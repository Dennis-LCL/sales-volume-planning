const disaggregatePosVolume = weeklyVolume => {
  const dailyPosVolume = [
    { dayOfWeek: 1, posVolume: 0 },
    { dayOfWeek: 2, posVolume: 0 },
    { dayOfWeek: 3, posVolume: 0 },
    { dayOfWeek: 4, posVolume: 0 },
    { dayOfWeek: 5, posVolume: 0 },
    { dayOfWeek: 6, posVolume: 0 },
    { dayOfWeek: 7, posVolume: 0 }
  ];
  const volumeQuotient = Math.floor(weeklyVolume / 7);
  let volumeRemainder = weeklyVolume % 7;

  return dailyPosVolume.map(dayOfWeek => {
    dayOfWeek.posVolume =
      volumeRemainder > 0 ? volumeQuotient + 1 : volumeQuotient;
    volumeRemainder -= 1;
    return dayOfWeek;
  });
};

const disaggregatePosVolumeByUplift = (baselinePosVolume, uplift) => {
  const dailyPosVolume = [
    { dayOfWeek: 1, posVolume: 0 },
    { dayOfWeek: 2, posVolume: 0 },
    { dayOfWeek: 3, posVolume: 0 },
    { dayOfWeek: 4, posVolume: 0 },
    { dayOfWeek: 5, posVolume: 0 },
    { dayOfWeek: 6, posVolume: 0 },
    { dayOfWeek: 7, posVolume: 0 }
  ];
  const weeklyVolume = baselinePosVolume * uplift
  const volumeQuotient = Math.floor(weeklyVolume / 7);
  let volumeRemainder = weeklyVolume % 7;

  return dailyPosVolume.map(dayOfWeek => {
    dayOfWeek.posVolume =
      volumeRemainder > 0 ? volumeQuotient + 1 : volumeQuotient;
    volumeRemainder -= 1;
    return dayOfWeek;
  });
};

module.exports = {disaggregatePosVolume, disaggregatePosVolumeByUplift};
