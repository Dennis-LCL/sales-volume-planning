// DATA
const createConsumerUnit = (amount = 0) => {
  if (_isPositiveInteger(amount) || amount === 0) {
    return Object.freeze({ volume: amount, unit: "CU" });
  } else {
    throw new Error("Consumer Unit volume must an integer >= 0");
  }
};

// BEHAVIORS
// const aggregateVolume = (...volume) => {
//   const addends = [...volume]
// }

// HELPER FUNCTIONS
const _isPositiveInteger = param => {
  return Number.isInteger(param) && Math.sign(param) === 1 ? true : false;
};

module.exports = { createConsumerUnit };
