const ConsumerUnit = require("../src/value-objects");

describe("CONSUMER UNIT", () => {
  describe("Constructor", () => {
    it("should accept ZERO & POSITIVE INTEGER ONLY as parameter", () => {
      expect(() => new ConsumerUnit(0)).not.toThrowError();
      expect(() => new ConsumerUnit(100)).not.toThrowError();
    });

    it("should reject FLOAT & NEGATIVE INTEGER as parameter and throw error", () => {
      expect(() => new ConsumerUnit(100.5)).toThrowError();
      expect(() => new ConsumerUnit(-100.5)).toThrowError();
      expect(() => new ConsumerUnit(-100)).toThrowError();
    });

    it("should create a ConsumerUnit object with amount 0 if no parameter received", () => {
      expect(new ConsumerUnit()).toMatchObject(new ConsumerUnit(0));
    });
  });

  describe("Methods", () => {
    describe("aggregate(ConsumerUnit)", () => {
      it("should only accept ConsumerUnit as parameter and return SUMMARY", () => {
        const cu = new ConsumerUnit(100);
        const addend = new ConsumerUnit(200);
        const summary = new ConsumerUnit(300);

        expect(cu.aggregate(addend)).toMatchObject(summary);
      });

      it("should reject Non-ConsumerUnit as parameter and throw error", () => {
        const cu = new ConsumerUnit(100);

        expect(() => cu.aggregate(10)).toThrowError(); // Positive Integer
        expect(() => cu.aggregate(-10)).toThrowError(); // Negative Integer
        expect(() => cu.aggregate(10.5)).toThrowError(); // Positive Float
        expect(() => cu.aggregate(-10.5)).toThrowError(); // Negative Float
        expect(() => cu.aggregate(0)).toThrowError(); // Zero (0)
        expect(() => cu.aggregate("I'm Groot")).toThrowError(); // String
        expect(() => cu.aggregate(true)).toThrowError(); // Boolean
      });
    });

    describe("deduct(ConsumerUnit)", () => {
      it("should only accept ConsumerUnit as parameter and return DIFFERENCE", () => {
        const minuend = new ConsumerUnit(100);
        const subtrahend = new ConsumerUnit(70);
        const difference = new ConsumerUnit(30);

        expect(minuend.deduct(subtrahend)).toMatchObject(difference);
      });

      it("should throw error if the Minuend is smaller than the Subtrahend", () => {
        const minuend = new ConsumerUnit(100);
        const subtrahend = new ConsumerUnit(70);
        const difference = new ConsumerUnit(30);

        expect(minuend.deduct(subtrahend)).toMatchObject(difference);
      });

      it("should reject Non-ConsumerUnit as parameter and throw error", () => {
        const minuend = new ConsumerUnit(100);

        expect(() => minuend.deduct(10)).toThrowError(); // Positive Integer
        expect(() => minuend.deduct(-10)).toThrowError(); // Negative Integer
        expect(() => minuend.deduct(10.5)).toThrowError(); // Positive Float
        expect(() => minuend.deduct(-10.5)).toThrowError(); // Negative Float
        expect(() => minuend.deduct(0)).toThrowError(); // Zero (0)
        expect(() => minuend.deduct("I'm Groot")).toThrowError(); // String
        expect(() => minuend.deduct(true)).toThrowError(); // Boolean
      });
    });

    describe("disaggregate(divisor)", () => {
      describe("Equal-Spread", () => {
        describe("Parameter Check", () => {
          it("should accept only POSITIVE INTEGER as parameter", () => {
            const dividend = new ConsumerUnit(100);
            const divisor = 5;

            expect(() => dividend.disaggregate(divisor)).not.toThrowError();
          });

          it("should reject Non-POSITIVE INTEGER as parameter and throw error", () => {
            const dividend = new ConsumerUnit(100);

            expect(() => dividend.disaggregate(-10)).toThrowError(); // Negative Integer
            expect(() => dividend.disaggregate(10.5)).toThrowError(); // Positive Float
            expect(() => dividend.disaggregate(-10.5)).toThrowError(); // Negative Float
            expect(() => dividend.disaggregate(0)).toThrowError(); // Zero (0)
            expect(() => dividend.disaggregate("I'm Groot")).toThrowError(); // String
            expect(() => dividend.disaggregate(true)).toThrowError(); // Boolean
          });
        });

        describe("remainder === 0", () => {
          it("should return a list of ConsumerUnits of equal amout", () => {
            const dividend = new ConsumerUnit(100);
            const divisor = 5;
            const result = [
              new ConsumerUnit(20),
              new ConsumerUnit(20),
              new ConsumerUnit(20),
              new ConsumerUnit(20),
              new ConsumerUnit(20)
            ];

            expect(dividend.disaggregate(divisor)).toMatchObject(result);
          });
        });
        describe("remainder > 0 ", () => {});
      });
    });

    describe("Uplift function", () => {});
  });
});
