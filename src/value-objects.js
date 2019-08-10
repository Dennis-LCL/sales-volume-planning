class ConsumerUnit {
  constructor(amount) {
    if (amount === undefined) {
      this.amount = 0;
    } else if (this._isPositiveInteger(amount) || amount === 0) {
      this.amount = amount;
    } else {
      throw new Error("Consumer Unit must be an integer >= 0");
    }
  }

  _isPositiveInteger(param) {
    return Number.isInteger(param) && Math.sign(param) === 1 ? true : false;
  }

  _isValidWeightageArray(array) {
    const verdict =
      array.filter(weightage => typeof weightage !== "number").length === 0 &&
      array.filter(weightage => weightage < 0 || weightage > 1).length === 0 &&
      array.reduce((total, weightage) => (total += weightage)) === 1
        ? true
        : false;

    return verdict;
  }

  _checkDivisorType(divisor) {
    if (this._isPositiveInteger(divisor)) {
      return "positive integer";
    } else if (this._isValidWeightageArray(divisor)) {
      return "weightage array";
    } else {
      return "invalid divisor";
    }
  }

  _spreadEqually(divisor) {
    const result = new Array(divisor).fill();
    const quotient = Math.floor(this.amount / divisor);
    let remainder = this.amount % divisor;

    return result.map(element => {
      remainder -= 1;
      return new ConsumerUnit(remainder >= 0 ? quotient + 1 : quotient);
    });
  }

  _spreadByWeightage(divisor) {
    const result = divisor.map(
      weightage => new ConsumerUnit(Math.round(this.amount * weightage))
    );

    const sumOfResult = result
      .map(element => element.amount)
      .reduce((total, amount) => (total += amount));

    const difference = sumOfResult - this.amount;

    if (difference > 0) {
      for (let i = 1; i <= difference; i++) {
        result[result.length - i].amount -= 1;
      }
    } else if (difference < 0) {
      for (let i = 0; i < Math.abs(difference); i++) {
        result[i].amount += 1;
      }
    }

    return result;
  }

  aggregate(addend) {
    if (!addend instanceof ConsumerUnit) {
      throw new Error("Aggregate method only accept ConsumerUnit as parameter");
    } else {
      return new ConsumerUnit(this.amount + addend.amount);
    }
  }

  disaggregate(divisor) {
    const divisorType = this._checkDivisorType(divisor);

    switch (divisorType) {
      case "positive integer":
        return this._spreadEqually(divisor);

      case "weightage array":
        return this._spreadByWeightage(divisor);

      case "invalid divisor":
        throw new Error(
          "Invalid divisor: must be a positive integer or an array of floats between 0 and 1 (inclusive)"
        );
    }
  }

  deduct(subtrahend) {
    if (!subtrahend instanceof ConsumerUnit) {
      throw new Error("Deduct method only accept ConsumerUnit as parameter");
    } else if (this.amount < subtrahend.amount) {
      throw new Error("Minuend must be >= Subtrahend");
    } else {
      return new ConsumerUnit(this.amount - subtrahend.amount);
    }
  }
}

module.exports = ConsumerUnit;
