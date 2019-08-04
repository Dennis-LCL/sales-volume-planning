const ConsumerUnit = require("../src/value-objects");

describe("CONSUMER UNIT", () => {
  describe("Constructor", () => {
    it("should accept INTEGER ONLY as parameter", () => {
      expect(() => new ConsumerUnit(0)).not.toThrowError();
      expect(() => new ConsumerUnit(100)).not.toThrowError();
      expect(() => new ConsumerUnit(-100)).not.toThrowError();
    });

    it("should reject NON-INTEGER as parameter and throw error", () => {
      expect(() => new ConsumerUnit(100.5)).toThrowError();
      expect(() => new ConsumerUnit(-100.5)).toThrowError();
    });

    it("should create a ConsumerUnit object with amount 0 if no parameter received", () => {
      expect(new ConsumerUnit()).toMatchObject(new ConsumerUnit(0));
    });
  });

  describe("Methods", () => {
    describe("Addition function", () => {
      it("should accept INTEGER ONLY as parameter and return SUMMARY", () => {
        const cu = new ConsumerUnit(100);

        expect(cu.add(0)).toMatchObject(new ConsumerUnit(100));
        expect(cu.add(100)).toMatchObject(new ConsumerUnit(200));
        expect(cu.add(-100)).toMatchObject(new ConsumerUnit(0));
      });

      it("should reject NON-INTEGER as paramter and throw error", () => {
        expect(() => cu.add(100.5)).toThrowError(); // Positive Float
        expect(() => cu.add(-100.5)).toThrowError(); // Negative Float
        expect(() => cu.add("I'm groot")).toThrowError(); // Not-A-Number
      });
    });

    describe("Subtraction function", () => {
      it("should accept INTEGER ONLY as parameter and return DIFFERENCE", () => {
        const cu = new ConsumerUnit(100);

        expect(cu.subtract(0)).toMatchObject(new ConsumerUnit(100));
        expect(cu.subtract(100)).toMatchObject(new ConsumerUnit(0));
        expect(cu.subtract(-50)).toMatchObject(new ConsumerUnit(150));
      });

      it("should reject NON-INTEGER as paramter and throw error", () => {
        const cu = new ConsumerUnit(100);

        expect(() => cu.subtract(100.5)).toThrowError(); // Positive Float
        expect(() => cu.subtract(-100.5)).toThrowError(); // Negative Float
        expect(() => cu.subtract("I'm groot")).toThrowError(); // Not-A-Number
      });
    });

    describe("Multiply function", () => {
      describe("Positive Consumer Unit", () => {
        const cu = new ConsumerUnit(10);

        it("should accept NUMBER as parameter and return PRODUCT", () => {
          expect(cu.multiply(1)).toMatchObject(new ConsumerUnit(10)); // Positive Integer
          expect(cu.multiply(1.5)).toMatchObject(new ConsumerUnit(15)); // Positive Float
          expect(cu.multiply(-1)).toMatchObject(new ConsumerUnit(-10)); // Negative Integer
          expect(cu.multiply(-0.1)).toMatchObject(new ConsumerUnit(-1)); // Negative Float
          expect(cu.multiply(0)).toMatchObject(new ConsumerUnit(0)); // Zero (0)
        });

        it("should return ROUNDED PRODUCT", () => {
          expect(cu.multiply(1.24)).toMatchObject(new ConsumerUnit(12));
          expect(cu.multiply(1.25)).toMatchObject(new ConsumerUnit(13));
          expect(cu.multiply(-1.34)).toMatchObject(new ConsumerUnit(-13));
          expect(cu.multiply(-1.35)).toMatchObject(new ConsumerUnit(-14));
        });

        it("should reject NON-NUMBER as parameter and throw error", () => {
          expect(() => cu.multiply("I'm groot")).toThrowError();
        });
      });

      describe("Negative Consumer Unit", () => {
        const cu = new ConsumerUnit(-10);

        it("should accept NUMBER as parameter and return PRODUCT", () => {
          expect(cu.multiply(1)).toMatchObject(new ConsumerUnit(-10)); // Positive Integer
          expect(cu.multiply(1.5)).toMatchObject(new ConsumerUnit(-15)); // Positive Float
          expect(cu.multiply(-1)).toMatchObject(new ConsumerUnit(10)); // Negative Integer
          expect(cu.multiply(-0.1)).toMatchObject(new ConsumerUnit(1)); // Negative Float
          expect(cu.multiply(0)).toMatchObject(new ConsumerUnit(0)); // Zero (0)
        });

        it("should return ROUNDED PRODUCT", () => {
          expect(cu.multiply(1.24)).toMatchObject(new ConsumerUnit(-12));
          expect(cu.multiply(1.25)).toMatchObject(new ConsumerUnit(-13));
          expect(cu.multiply(-1.34)).toMatchObject(new ConsumerUnit(13));
          expect(cu.multiply(-1.35)).toMatchObject(new ConsumerUnit(14));
        });
      });
    });

    describe("Divide function", () => {
      describe("Positive Consumer Unit", () => {
        const cu = new ConsumerUnit(10);

        it("should accept POSITIVE INTEGER ONLY as parameter and return QUOTIENT and REMAINDER", () => {
          const result = {
            quotient: new ConsumerUnit(3),
            remainder: new ConsumerUnit(1)
          };

          expect(cu.divide(3)).toMatchObject(result);
        });

        it("should reject ZERO and NEGATIVE INTEGER as parameter and throw error", () => {
          expect(() => cu.divide(-3)).toThrowError(); // Negative Integer
          expect(() => cu.divide(0)).toThrowError(); // Zero (0)
        });

        it("should reject FLOAT & NON-NUMBER as parameter and throw error", () => {
          expect(() => cu.divide(3.5)).toThrowError(); // Positive Float
          expect(() => cu.divide(-3.5)).toThrowError(); // Negative Float
          expect(() => cu.divide("I'm groot")).toThrowError(); // Not-A-Number
        });
      });

      describe("Negative Consumer Unit", () => {
        cu = new ConsumerUnit(-10);

        it("should accept POSITIVE INTEGER ONLY as parameter and return QUOTIENT and REMAINDER", () => {
          const result = {
            quotient: new ConsumerUnit(-3),
            remainder: new ConsumerUnit(-1)
          };

          expect(cu.divide(3)).toMatchObject(result);
        });
      });
    });
  });
});
