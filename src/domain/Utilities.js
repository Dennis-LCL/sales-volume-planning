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

const _foundNonBaseListPriceObject = args => {
  return args.some(
    arg =>
      arg.amount === undefined ||
      arg.currency === undefined ||
      Math.sign(arg.amount) !== 1
  );
};

module.exports = {
  _isPositiveInteger,
  _foundNonVolumeObject,
  _foundNonBaseListPriceObject
};
