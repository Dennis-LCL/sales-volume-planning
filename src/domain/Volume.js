// DATA
const createConsumerUnit = (amount = 0) => {
  if (_isPositiveInteger(amount) || amount === 0) {
    return Object.freeze({ volume: amount, unit: "CU" });
  } else {
    throw new Error("Consumer Unit volume must be an integer >= 0");
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

const disaggregateVolume = (dividend, divisor) => {
  if (_isPositiveInteger(divisor)) {
    return _spreadEqually(dividend, divisor);
  } else {
    throw new Error("Divisor must be a positive integer");
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

const _spreadEqually = (dividend, divisor) => {
  const result = new Array(divisor).fill();
  const quotient = Math.floor(dividend.volume / divisor);
  let remainder = dividend.volume % divisor;

  return result.map(element => {
    remainder -= 1;
    return createConsumerUnit(remainder >= 0 ? quotient + 1 : quotient);
  });
};

module.exports = { createConsumerUnit, aggregateVolume, disaggregateVolume };
