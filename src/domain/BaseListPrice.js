// DATA
const createBaseListPrice = (amount, currency) => {
  if (Math.sign(amount) === 1) {
    return Object.freeze({ amount: amount, currency: currency });
  } else {
    throw new Error("Base List Price must be > 0");
  }
};

// HELPER FUNCTIONS
const _foundNonBaseListPriceObject = args => {
  return args.some(
    arg =>
      arg.amount === undefined ||
      arg.currency === undefined ||
      Math.sign(arg.amount) !== 1
  );
};

module.exports = { createBaseListPrice, _foundNonBaseListPriceObject };
