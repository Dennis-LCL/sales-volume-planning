class ConsumerUnit {
  constructor(amount) {
    if (Number.isInteger(amount)) {
      this.amount = amount;
    } else if (amount === undefined) {
      this.amount = 0;
    } else {
      throw new Error("Consumer Unit must be an integer");
    }
  }

  isNumber(param) {
    if (typeof param !== "number") {
      throw new Error("Parameter can only be a number");
    }
  }

  add(amount) {
    try {
      this.isNumber(amount);
      const addend = new ConsumerUnit(amount);
      return new ConsumerUnit(this.amount + addend.amount);
    } catch (error) {
      console.log(error);
      throw new Error(`Addition failed: ${error.message}`);
    }
  }

  subtract(amount) {
    try {
      this.isNumber(amount);
      const subtrahend = new ConsumerUnit(amount);
      return new ConsumerUnit(this.amount - subtrahend.amount);
    } catch (error) {
      console.log(error);
      throw new Error(`Subtraction failed: ${error.message}`);
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
