class ConsumerUnit {
  constructor(amount) {
    if (amount === undefined) {
      this.amount = 0;
    } else if (this.isPositiveInteger(amount) || amount === 0) {
      this.amount = amount;
    } else {
      throw new Error("Consumer Unit must be an integer >= 0");
    }
  }

  isPositiveInteger(param) {
    return Number.isInteger(param) && Math.sign(param) === 1 ? true : false;
  }

  // isValidWeightageArray(weightageArray) {
  //   if (weightageArray instanceof Array) {
  //     const invalidWeightageCount = weightageArray.filter(weightage => {
  //       return typeof weightage !== "number" || weightage < 0 || weightage > 1;
  //     }).length;

  //     if (invalidWeightageCount === 0) {
  //       const weightageSum = weightageArray.reduce((total, weightage) => {
  //         return (total += weightage);
  //       });
  //       return weightageSum === 1 ? true : false;
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return false;
  //   }
  // }

  isValidWeightageArray(array) {
    const verdict =
      array.filter(weightage => typeof weightage !== "number").length === 0 &&
      array.filter(weightage => weightage < 0 || weightage > 1).length === 0 &&
      array.reduce((total, weightage) => (total += weightage)) === 1
        ? true
        : false;

    return verdict;
  }

  checkDivisorType(divisor) {
    if (this.isPositiveInteger(divisor)) {
      return "positive integer";
    } else if (this.isValidWeightageArray(divisor)) {
      return "weightage array";
    } else {
      return "invalid divisor";
    }
  }

  aggregate(addend) {
    if (!addend instanceof ConsumerUnit) {
      throw new Error("Aggregate method only accept ConsumerUnit as parameter");
    } else {
      return new ConsumerUnit(this.amount + addend.amount);
    }
  }

  spreadEqually(divisor) {
    const result = new Array(divisor).fill();
    const quotient = Math.floor(this.amount / divisor);
    let remainder = this.amount % divisor;

    return result.map(element => {
      remainder -= 1;
      return new ConsumerUnit(remainder >= 0 ? quotient + 1 : quotient);
    });
  }

  disaggregate(divisor) {
    const divisorType = this.checkDivisorType(divisor);

    switch (divisorType) {
      case "positive integer":
        return this.spreadEqually(divisor);

      case "weightage array":
        return "Valid Weightage Array";

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
