const _isInteger = param => {
  return Number.isInteger(param);
};

const _isPositiveInteger = param => {
  return Number.isInteger(param) && Math.sign(param) === 1 ? true : false;
};

const _foundNonBaseListPriceObject = args => {
  return args.some(
    arg =>
      arg.amount === undefined ||
      arg.currency === undefined ||
      Math.sign(arg.amount) !== 1
  );
};

module.exports = {
  _isInteger,
  _isPositiveInteger,
  _foundNonBaseListPriceObject
};
