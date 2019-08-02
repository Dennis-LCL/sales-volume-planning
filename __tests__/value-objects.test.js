const ConsumerUnit = require("../src/value-objects");

describe("CONSUMER UNIT", () => {
  describe("Constructor", () => {
    it("should accept INTEGER as parameter", () => {
      expect(() => {
        new ConsumerUnit(0);
      }).not.toThrowError();
      expect(() => {
        new ConsumerUnit(100);
      }).not.toThrowError();
      expect(() => {
        new ConsumerUnit(-100);
      }).not.toThrowError();
    });

    it("should reject NON-INTEGER as parameter and throw error", () => {
      expect(() => {
        new ConsumerUnit(100.5);
      }).toThrowError();
      expect(() => {
        new ConsumerUnit(-100.5);
      }).toThrowError();
    });

    it("should create a ConsumerUnit object with amount 0 if no parameter received", () => {
      expect(new ConsumerUnit()).toMatchObject(new ConsumerUnit(0));
    });
  });

  describe("Methods", () => {
    describe("Addition function", () => {
      it("should accept INTEGER as parameter and return SUMMARY", () => {
        const consumerUnit = new ConsumerUnit(100);

        expect(consumerUnit.add(0)).toMatchObject(new ConsumerUnit(100));
        expect(consumerUnit.add(100)).toMatchObject(new ConsumerUnit(200));
        expect(consumerUnit.add(-100)).toMatchObject(new ConsumerUnit(0));
      });

      it("should reject NON-INTEGER as paramter and throw error", () => {
        const consumerUnit = new ConsumerUnit(100);

        expect(() => {
          consumerUnit.add(100.5);
        }).toThrowError();
        expect(() => {
          consumerUnit.add(-100.5);
        }).toThrowError();
      });
    });

    describe("Subtraction function", () => {
      it("should accept INTEGER as parameter and return DIFFERENCE", () => {
        const consumerUnit = new ConsumerUnit(100);

        expect(consumerUnit.subtract(0)).toMatchObject(new ConsumerUnit(100));
        expect(consumerUnit.subtract(100)).toMatchObject(new ConsumerUnit(0));
        expect(consumerUnit.subtract(-50)).toMatchObject(new ConsumerUnit(150));
      });

      it("should reject NON-INTEGER as paramter and throw error", () => {
        const consumerUnit = new ConsumerUnit(100);

        expect(() => {
          consumerUnit.subtract(100.5);
        }).toThrowError();
        expect(() => {
          consumerUnit.subtract(-100.5);
        }).toThrowError();
      });
    });
  });
});
