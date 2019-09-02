const {
  _foundNonVolumeObject,
  _foundNonBaseListPriceObject
} = require("../domain/Utilities.js");

// DATA
const calculateGIV = (volume, baseListPrice) => {
  if (
    _foundNonVolumeObject([volume]) ||
    _foundNonBaseListPriceObject([baseListPrice])
  ) {
    throw new Error("Must pass in valid Volume and BaseListPrice object");
  } else {
    return Object.freeze({
      amount: volume.volume * baseListPrice.amount,
      currency: baseListPrice.currency
    });
  }
};

module.exports = { calculateGIV };
