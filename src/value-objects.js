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

  add(amount) {
    try {
      const addend = new ConsumerUnit(amount);
      return new ConsumerUnit(this.amount + addend.amount);
    } catch (error) {
      throw new Error(`Addition failed: ${error.message}`);
    }
  }

  subtract(amount) {
    try {
      const subtrahend = new ConsumerUnit(amount);
      return new ConsumerUnit(this.amount - subtrahend.amount);
    } catch (error) {
      throw new Error(`Subtraction failed: ${error.message}`);
    }
  }
}

module.exports = ConsumerUnit;
