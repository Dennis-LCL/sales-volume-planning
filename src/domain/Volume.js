// DATA
const createConsumerUnit = (amount = 0) => {
  if (_isPositiveInteger(amount) || amount === 0) {
    return Object.freeze({ volume: amount, unit: "CU" });
  } else {
    throw new Error("Consumer Unit volume must an integer >= 0");
  }
};

// BEHAVIORS
const aggregateVolume = (...args) => {
  if (_foundNonVolumeObject(args) || _foundMultipleUnits(args)) {
    throw new Error(
      "Arguements should be valid Volume object and of the same unit"
    );
  } else {
    const amount = args
      .map(arg => arg.volume)
      .reduce((sum, volume) => (sum += volume));
    return createConsumerUnit(amount);
  }
};

// HELPER FUNCTIONS
const _isPositiveInteger = param => {
  return Number.isInteger(param) && Math.sign(param) === 1 ? true : false;
};

const _foundNonVolumeObject = args => {
  return args.some(
    arg =>
      arg.volume === undefined ||
      arg.unit === undefined ||
      !_isPositiveInteger(arg.volume)
  );
};

const _foundMultipleUnits = args => {
  const unitSet = new Set();
  args.forEach(arg => unitSet.add(arg.unit));
  return unitSet.size > 1 ? true : false;
};

module.exports = { createConsumerUnit, aggregateVolume };
