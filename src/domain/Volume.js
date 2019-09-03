const { _isPositiveInteger } = require("../domain/Utilities");

// DATA
const createVolume = (amount = 0, unit) => {
  switch (unit) {
    case "CU":
      return Number.isInteger(amount)
        ? _returnFrozenVolumeObject(amount, "CU")
        : _throwError("ConsumerUnit Volume must be an integer");

    default:
      return _throwError("Unspecified or undefined Volume unit");
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
    return createVolume(amount, args[0].unit);
  }
};

const disaggregateVolume = (dividend, divisor) => {
  const divisorType = _checkDivisorType(divisor);

  switch (divisorType) {
    case "positive integer":
      return _spreadEqually(dividend, divisor);

    case "weightage array":
      return _spreadByWeightage(dividend, divisor);

    case "invalid divisor":
      throw new Error(
        "Invalid divisor: must be a positive integer or an array of floats between 0 and 1 (inclusive)"
      );
  }
};

const upliftVolumeByAmount = (addend, upliftAmount) => {
  if (_isPositiveInteger(upliftAmount)) {
    return _adjustVolumeByAmount(addend, upliftAmount);
  } else {
    throw new Error("upliftAmount must be a positive integer");
  }
};

const deductVolumeByAmount = (minuend, deductAmount) => {
  if (_isPositiveInteger(deductAmount) && deductAmount <= minuend.volume) {
    return _adjustVolumeByAmount(minuend, -deductAmount);
  } else {
    throw new Error(
      "deductAmount must be a positive integer and <= minuend.volume"
    );
  }
};

const upliftVolumeByPercentage = (addend, upliftPercentage) => {
  if (typeof upliftPercentage === "number" && upliftPercentage > 1) {
    return _adjustVolumeByPercentage(addend, upliftPercentage);
  } else {
    throw new Error("upliftPercentage must be a number > 1");
  }
};

const deductVolumeByPercentage = (minuend, deductPercentage) => {
  if (
    typeof deductPercentage === "number" &&
    deductPercentage > 0 &&
    deductPercentage < 1
  ) {
    return _adjustVolumeByPercentage(minuend, deductPercentage);
  } else {
    throw new Error(
      "deductPercentage must be a number btw. 0 and 1 (exclusive)"
    );
  }
};

// HELPER FUNCTIONS
const _returnFrozenVolumeObject = (amount, unit) => {
  return Object.freeze({ volume: amount, unit: unit });
};

const _throwError = message => {
  throw new Error(message);
};

const _foundNonVolumeObject = args => {
  const hasVolumeObjectKeys = args.some(
    arg => arg.volume !== undefined || arg.unit !== undefined
  );

  const hasValidVolume = args.some(arg =>
    arg.unit === "CU"
      ? !Number.isInteger(arg.amount)
      : typeof arg.amount !== "number"
  );

  return hasVolumeObjectKeys && hasValidVolume ? false : true;
};

const _foundMultipleUnits = args => {
  const unitSet = new Set();
  args.forEach(arg => unitSet.add(arg.unit));
  return unitSet.size > 1 ? true : false;
};

const _checkDivisorType = divisor => {
  if (_isPositiveInteger(divisor)) {
    return "positive integer";
  } else if (_isValidWeightageArray(divisor)) {
    return "weightage array";
  } else {
    return "invalid divisor";
  }
};

const _isValidWeightageArray = array => {
  const verdict =
    array.filter(weightage => typeof weightage !== "number").length === 0 &&
    array.filter(weightage => weightage < 0 || weightage > 1).length === 0 &&
    array.reduce((total, weightage) => (total += weightage)) === 1
      ? true
      : false;

  return verdict;
};

const _spreadEqually = (dividend, divisor) => {
  const result = new Array(divisor).fill();
  const quotient = Math.floor(dividend.volume / divisor);
  let remainder = dividend.volume % divisor;

  return result.map(element => {
    remainder -= 1;
    return createVolume(
      remainder >= 0 ? quotient + 1 : quotient,
      dividend.unit
    );
  });
};

const _spreadByWeightage = (dividend, divisor) => {
  const result = divisor.map(weightage =>
    createVolume(Math.round(dividend.volume * weightage), dividend.unit)
  );

  const sumOfResult = result
    .map(element => element.volume)
    .reduce((total, volume) => (total += volume));

  const difference = sumOfResult - dividend.volume;

  if (difference > 0) {
    // If sumOfResult is too much, deduct from the end of array
    for (let i = 1; i <= difference; i++) {
      const adjustedVolume = result[result.length - i].volume - 1;
      result[result.length - i] = createVolume(adjustedVolume, dividend.unit);
    }
  } else if (difference < 0) {
    // If sumOfResult is not enough, add from the beginning of array
    for (let i = 0; i < Math.abs(difference); i++) {
      const adjustedVolume = result[i].volume + 1;
      result[i] = createVolume(adjustedVolume, dividend.unit);
    }
  }

  return result;
};

const _adjustVolumeByAmount = (volumeObject, adjustment) => {
  if (!_foundNonVolumeObject([volumeObject]) && Number.isInteger(adjustment)) {
    return createVolume(volumeObject.volume + adjustment, volumeObject.unit);
  } else {
    throw new Error("Must pass in a valid Volume object and an integer");
  }
};

const _adjustVolumeByPercentage = (volumeObject, adjustment) => {
  if (!_foundNonVolumeObject([volumeObject]) && Math.sign(adjustment) === 1) {
    return createVolume(volumeObject.volume * adjustment, volumeObject.unit);
  } else {
    throw new Error("Must pass in a valid Volume object and number > 0");
  }
};

module.exports = {
  createVolume,
  aggregateVolume,
  disaggregateVolume,
  upliftVolumeByAmount,
  upliftVolumeByPercentage,
  deductVolumeByPercentage,
  deductVolumeByAmount
};
