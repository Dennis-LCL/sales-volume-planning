const disaggregatePosVolume = weeklyVolume => {
  const dailyPosVolume = [];
  const volumeQuotient = Math.floor(weeklyVolume / 7);
  const volumeRemainder = weeklyVolume % 7;
  for (let i = 0; i < 6; i++) {
    dailyPosVolume.push(volumeQuotient);
  }
  dailyPosVolume.push(volumeQuotient + volumeRemainder);
  return dailyPosVolume;
};

module.exports = disaggregatePosVolume;
