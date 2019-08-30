const { _foundNonVolumeObject } = require("../domain/Volume.js");
const { _foundNonBaseListPriceObject } = require("../domain/BaseListPrice");

// DATA
const calculateGIV = (volume, baseListPrice) => {
  if (
    _foundNonVolumeObject([volume]) ||
    _foundNonBaseListPriceObject([baseListPrice])
  ) {
    throw new Error("Must pass in valid Volume and BaseListPrice object");
  } else {
    return {
      amount: volume.volume * baseListPrice.amount,
      currency: baseListPrice.currency
    };
  }
};

module.exports = { calculateGIV };
