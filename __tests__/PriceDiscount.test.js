const PriceDiscount = require("../src/PriceDiscount");

describe("PRICE DISCOUNT", () => {
  describe("Constructor", () => {
    it("should accept a FLOAT between 0 and 1 (exclusive) as parameter", () => {
      const lessThanZero = -0.5;
      const zero = 0;
      const betweenZeroAndOne = 0.5;
      const one = 1;
      const largerThanOne = 1.5;

      expect(() => new PriceDiscount(lessThanZero)).toThrowError();
      expect(() => new PriceDiscount(zero)).toThrowError();
      expect(() => new PriceDiscount(one)).toThrowError();
      expect(() => new PriceDiscount(largerThanOne)).toThrowError();
      expect(() => new PriceDiscount(betweenZeroAndOne)).not.toThrowError();
    });

    describe("Methods", () => {
      describe("update(newDiscount", () => {
        it("should accept a FLOAT between 0 and 1 (exclusive) and return a new PriceDiscount object", () => {
          const originalDiscount = 0.3;
          const newDiscount = 0.3;

          priceDiscount = new PriceDiscount(originalDiscount);

          expect(priceDiscount.update(newDiscount)).not.toBe(priceDiscount);
        });
      });
    });
  });
});
