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
  const foundErrorInArgs = args.some(arg => arg.volume === undefined);

  if (foundErrorInArgs) {
    throw new Error("One or more arguements are not valid Volume object");
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

module.exports = { createConsumerUnit, aggregateVolume };
