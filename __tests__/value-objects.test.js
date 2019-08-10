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

        describe("remainder > 0 ", () => {
          it("should return a list of ConsumerUnits with remainder (1) allocated as equally as possible", () => {
            const dividend = new ConsumerUnit(6);
            const divisor = 5;
            const result = [
              new ConsumerUnit(2),
              new ConsumerUnit(1),
              new ConsumerUnit(1),
              new ConsumerUnit(1),
              new ConsumerUnit(1)
            ];

            expect(dividend.disaggregate(divisor)).toMatchObject(result);
          });

          it("should return a list of ConsumerUnits with remainder (2) allocated as equally as possible", () => {
            const dividend = new ConsumerUnit(7);
            const divisor = 5;
            const result = [
              new ConsumerUnit(2),
              new ConsumerUnit(2),
              new ConsumerUnit(1),
              new ConsumerUnit(1),
              new ConsumerUnit(1)
            ];

            expect(dividend.disaggregate(divisor)).toMatchObject(result);
          });

          it("should return a list of ConsumerUnits with remainder (3) allocated as equally as possible", () => {
            const dividend = new ConsumerUnit(8);
            const divisor = 5;
            const result = [
              new ConsumerUnit(2),
              new ConsumerUnit(2),
              new ConsumerUnit(2),
              new ConsumerUnit(1),
              new ConsumerUnit(1)
            ];

            expect(dividend.disaggregate(divisor)).toMatchObject(result);
          });

          it("should return a list of ConsumerUnits with remainder (4) allocated as equally as possible", () => {
            const dividend = new ConsumerUnit(9);
            const divisor = 5;
            const result = [
              new ConsumerUnit(2),
              new ConsumerUnit(2),
              new ConsumerUnit(2),
              new ConsumerUnit(2),
              new ConsumerUnit(1)
            ];

            expect(dividend.disaggregate(divisor)).toMatchObject(result);
          });
        });
      });

      describe("Weightage-Spread", () => {
        describe("Parameter Check", () => {
          it("should accept only ARRAY OF FLOATS between 0 and 1 (inclusive)", () => {
            const dividend = new ConsumerUnit(100);
            const zeroAndOne = [0.0, 1.0];
            const inRange = [0.5, 0.5];
            const outOfRange = [-0.5, -0.3, 1.8];
            const notANumber = ["I'm Groot", "I'm Groot", "I'm Groot"];

            expect(() => dividend.disaggregate(zeroAndOne)).not.toThrowError();
            expect(() => dividend.disaggregate(inRange)).not.toThrowError();
            expect(() => dividend.disaggregate(outOfRange)).toThrowError();
            expect(() => dividend.disaggregate(notANumber)).toThrowError();
          });

          it("should accept only ARRAY OF FLOATS sum up to 1", () => {
            const dividend = new ConsumerUnit(100);
            const equalToOne = [0.0, 1.0];
            const largerThanOne = [0.5, 0.8];
            const lessThanOne = [0.5, 0.3];

            expect(() => dividend.disaggregate(equalToOne)).not.toThrowError();
            expect(() => dividend.disaggregate(largerThanOne)).toThrowError();
            expect(() => dividend.disaggregate(lessThanOne)).toThrowError();
          });
        });

        describe("PRODUCT is a POSITIVE INTEGER or ZERO after applying weightage", () => {
          it("should return a list of ConsumerUnits by applying weightage x amount", () => {
            const dividend = new ConsumerUnit(10);
            const divisor = [0.5, 0.3, 0.2];
            const result = [
              new ConsumerUnit(5),
              new ConsumerUnit(3),
              new ConsumerUnit(2)
            ];

            expect(dividend.disaggregate(divisor)).toMatchObject(result);
          });
        });

        describe("PRODUCT is a POSITIVE FLOAT after applying weightage", () => {
          it("should return a list of ConsumerUnits by rounding each element", () => {
            const dividend = new ConsumerUnit(10);
            const divisor = [0.55, 0.24, 0.21];
            const result = [
              new ConsumerUnit(6),
              new ConsumerUnit(2),
              new ConsumerUnit(2)
            ];

            expect(dividend.disaggregate(divisor)).toMatchObject(result);
          });

          it("should return a list of ConsumerUnits sum up to dividend: SUM of Rounded ConsumerUnits = Dividend", () => {
            const dividend = new ConsumerUnit(10);
            const divisor = [0.55, 0.25, 0.2];
            const result = [
              new ConsumerUnit(6),
              new ConsumerUnit(3),
              new ConsumerUnit(1)
            ];

            expect(dividend.disaggregate(divisor)).toMatchObject(result);
          });

          it("should return a list of ConsumerUnits sum up to dividend: SUM of Rounded ConsumerUnits > Dividend", () => {
            const dividend = new ConsumerUnit(10);
            const divisor = [0.25, 0.25, 0.25, 0.25];
            const result = [
              new ConsumerUnit(3),
              new ConsumerUnit(3),
              new ConsumerUnit(2),
              new ConsumerUnit(2)
            ];

            expect(dividend.disaggregate(divisor)).toMatchObject(result);
          });

          it("should return a list of ConsumerUnits sum up to dividend: SUM of Rounded ConsumerUnits < Dividend", () => {
            const dividend = new ConsumerUnit(10);
            const divisor = [0.53, 0.33, 0.14];
            const result = [
              new ConsumerUnit(6),
              new ConsumerUnit(3),
              new ConsumerUnit(1)
            ];

            expect(dividend.disaggregate(divisor)).toMatchObject(result);
          });
        });
      });
    });

    describe("Uplift function", () => {});
  });
});
