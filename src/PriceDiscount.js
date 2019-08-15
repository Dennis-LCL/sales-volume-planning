class PriceDiscount {
  constructor(discount) {
    if (typeof discount === "number" && discount > 0 && discount < 1) {
      this.discount = discount;
    } else {
      throw new Error(
        "Price Discount must be a float number between 0 and 1 (exclusive)"
      );
    }
  }

  update(newDiscount) {
    return new PriceDiscount(newDiscount);
  }
}

module.exports = PriceDiscount;
