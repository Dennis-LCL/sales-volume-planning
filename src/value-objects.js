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

  aggregate(addend) {
    if (!addend instanceof ConsumerUnit) {
      throw new Error("Aggregate method only accept ConsumerUnit as parameter");
    } else {
      return new ConsumerUnit(this.amount + addend.amount);
    }
  }

  disaggregate(divisor) {
    if (!this.isPositiveInteger(divisor)) {
      throw new Error("Diviulsor must be a positive integer");
    } else {
      const result = new Array(divisor).fill();
      const quotient = Math.floor(this.amount / divisor);
      let remainder = this.amount % divisor;

      return result.map(element => {
        remainder -= 1;
        return new ConsumerUnit(remainder >= 0 ? quotient + 1 : quotient);
      });
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

  isValidAddendOrSubtrahend(param) {
    return Number.isInteger(param) || param instanceof ConsumerUnit
      ? true
      : new Error("must be an integer or a ConsumerUnit");
  }

  isValidFactor(param) {
    return typeof param === "number" ? true : new Error("must be a number");
  }

  isValidDivisor(param) {
    return Number.isInteger(param) && Math.sign(param) === 1
      ? true
      : new Error("must be a positive integer");
  }

  isNumber(param) {
    if (typeof param !== "number") {
      throw new Error("Parameter can only be a number");
    }
  }

  add(addend) {
    this.isValidAddendOrSubtrahend(addend);
    if (addend instanceof ConsumerUnit) {
      return new ConsumerUnit(this.amount + addend.amount);
    } else {
      try {
        this.isNumber(addend);
        const addendInConsumerUnit = new ConsumerUnit(addend);
        return new ConsumerUnit(this.amount + addendInConsumerUnit.amount);
      } catch (error) {
        console.log(error);
        throw new Error(`Addition failed: ${error.message}`);
      }
    }
  }

  subtract(subtrahend) {
    if (subtrahend instanceof ConsumerUnit) {
      return new ConsumerUnit(this.amount - subtrahend.amount);
    } else {
      try {
        this.isNumber(subtrahend);
        const subtrahendInConsumerUnit = new ConsumerUnit(subtrahend);
        return new ConsumerUnit(this.amount - subtrahendInConsumerUnit.amount);
      } catch (error) {
        console.log(error);
        throw new Error(`Subtraction failed: ${error.message}`);
      }
    }
  }

  multiply(factor) {
    try {
      this.isNumber(factor);
      return factor === 0
        ? new ConsumerUnit(0)
        : new ConsumerUnit(
            Math.sign(this.amount * factor) *
              Math.round(Math.abs(this.amount * factor))
          );
    } catch (error) {
      console.log(error);
      throw new Error(`Multiplication failed: ${error.message}`);
    }
  }

  divide(divisor) {
    try {
      this.isNumber(divisor);
      if (Math.sign(divisor) === 1 && Number.isInteger(divisor)) {
        const quotient =
          Math.sign(this.amount) * Math.floor(Math.abs(this.amount) / divisor);
        const remainder = this.amount % divisor;
        return {
          quotient: new ConsumerUnit(quotient),
          remainder: new ConsumerUnit(remainder)
        };
      } else {
        throw new Error(
          "Divisor cannot be zero (0) and must be a positive integer"
        );
      }
    } catch (error) {
      console.log(error);
      throw new Error(`Division failed: ${error.message}`);
    }
  }
}

module.exports = ConsumerUnit;
