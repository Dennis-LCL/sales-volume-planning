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

const upliftVolume = (addend, uplift) => {
  if (
    !_foundNonVolumeObject([addend, uplift]) &&
    !_foundMultipleUnits([addend, uplift])
  ) {
    return createConsumerUnit(addend.volume + uplift.volume);
  } else if (
    !_foundNonVolumeObject([addend]) &&
    typeof uplift === "number" &&
    uplift > 1
  ) {
    return createConsumerUnit(addend.volume * uplift);
  } else {
    throw new Error("Uplift must be a valid Volume object or a number > 1");
  }
};

const deductVolume = (minuend, deduct) => {
  if (
    !_foundNonVolumeObject([minuend, deduct]) &&
    !_foundMultipleUnits([minuend, deduct])
  ) {
    if (minuend.volume >= deduct.volume) {
      return createConsumerUnit(minuend.volume - deduct.volume);
    } else {
      throw new Error("Minuend must be larger or equal to Subtrahend");
    }
  } else if (
    !_foundNonVolumeObject([minuend]) &&
    typeof deduct === "number" &&
    deduct > 0 &&
    deduct < 1
  ) {
    return createConsumerUnit(minuend.volume * deduct);
  } else {
    throw new Error(
      "Deduct must be a valid Volume object or a number between 0 and 1 (exclusive)"
    );
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
    return createConsumerUnit(remainder >= 0 ? quotient + 1 : quotient);
  });
};

const _spreadByWeightage = (dividend, divisor) => {
  const result = divisor.map(weightage =>
    createConsumerUnit(Math.round(dividend.volume * weightage))
  );

  const sumOfResult = result
    .map(element => element.volume)
    .reduce((total, volume) => (total += volume));

  const difference = sumOfResult - dividend.volume;

  if (difference > 0) {
    // If sumOfResult is too much, deduct from the end of array
    for (let i = 1; i <= difference; i++) {
      const adjustedVolume = result[result.length - i].volume - 1;
      result[result.length - i] = createConsumerUnit(adjustedVolume);
    }
  } else if (difference < 0) {
    // If sumOfResult is not enough, add from the beginning of array
    for (let i = 0; i < Math.abs(difference); i++) {
      const adjustedVolume = result[i].volume + 1;
      result[i] = createConsumerUnit(adjustedVolume);
    }
  }

  return result;
};

module.exports = {
  createConsumerUnit,
  aggregateVolume,
  disaggregateVolume,
  upliftVolume,
  deductVolume
};
