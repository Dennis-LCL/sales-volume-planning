const {
  createConsumerUnit,
  aggregateVolume,
  disaggregateVolume
} = require("../src/domain/Volume");

describe("createConsumerUnit", () => {
  it("should only accept ZERO and POSITIVE INTEGER as parameter", () => {
    expect(() => createConsumerUnit(0)).not.toThrowError();
    expect(() => createConsumerUnit(100)).not.toThrowError();
  });

  it("should reject FLOAT & NEGATIVE INTEGER as parameter and throw error", () => {
    expect(() => createConsumerUnit(100.5)).toThrowError();
    expect(() => createConsumerUnit(-100.5)).toThrowError();
    expect(() => createConsumerUnit(-100)).toThrowError();
  });

  it("should create a ConsumerUnit object with amount 0 if no parameter received", () => {
    const expectedObject = createConsumerUnit(0);
    const noParamObject = createConsumerUnit();
    expect(noParamObject).toMatchObject(expectedObject);
  });

  it("should make created Consumer Unit Volume object immutable", () => {
    const cu = createConsumerUnit(100);
    const expectedObject = createConsumerUnit(100);
    cu.volume = 50;
    expect(cu).toMatchObject(expectedObject);
  });
});

describe("aggregateVolume", () => {
  it("should aggregate 'volume' of 2 Volume objects of the same 'unit", () => {
    const cu1 = createConsumerUnit(100);
    const cu2 = createConsumerUnit(50);
    const expectedVolume = createConsumerUnit(150);

    expect(aggregateVolume(cu1, cu2)).toMatchObject(expectedVolume);
  });

  it("should aggregate 'volume' of 3 Volume objects of the same 'unit", () => {
    const cu1 = createConsumerUnit(100);
    const cu2 = createConsumerUnit(50);
    const cu3 = createConsumerUnit(30);
    const expectedVolume = createConsumerUnit(180);

    expect(aggregateVolume(cu1, cu2, cu3)).toMatchObject(expectedVolume);
  });

  it("should throw error if any pass-in arguement is NOT a Volume object", () => {
    const cu = createConsumerUnit(100);
    const number = 10;
    const str = "I'm Groot";
    const wrongObject1 = { value: 100, unit: "USD" }; // Invalid key (value)
    const wrongObject2 = { volume: 100, code: "USD" }; // Invalid key (code)
    const wrongObject3 = { volume: -100, unit: "USD" }; // Negative volume

    expect(() => aggregateVolume(cu, number)).toThrowError(
      "Arguements should be valid Volume object and of the same unit"
    );
    expect(() => aggregateVolume(cu, str)).toThrowError(
      "Arguements should be valid Volume object and of the same unit"
    );
    expect(() => aggregateVolume(cu, wrongObject1)).toThrowError(
      "Arguements should be valid Volume object and of the same unit"
    );
    expect(() => aggregateVolume(cu, wrongObject2)).toThrowError(
      "Arguements should be valid Volume object and of the same unit"
    );
    expect(() => aggregateVolume(cu, wrongObject3)).toThrowError(
      "Arguements should be valid Volume object and of the same unit"
    );
  });

  it("should throw error if any pass-in arguements have different 'unit' value", () => {
    const consumerUnit = { volume: 100, unit: "CU" };
    const caseUnit = { volume: 50, unit: "CS" };
    const statsUnit = { volume: 30, unit: "SU" };

    expect(() =>
      aggregateVolume(consumerUnit, caseUnit, statsUnit)
    ).toThrowError(
      "Arguements should be valid Volume object and of the same unit"
    );
  });
});

describe("disaggregateVolume", () => {
  describe("Equal-Spread", () => {
    it("should only accept POSITIVE INTEGER as parameter", () => {
      const dividend = createConsumerUnit(100);
      const positiveInteger = 2;
      const zero = 0;
      const negativeInteger = -2;
      const positiveFloat = 1.5;
      const negativeFloat = -1.5;
      const str = "I'm Groot";

      expect(() =>
        disaggregateVolume(dividend, positiveInteger)
      ).not.toThrowError();
      expect(() => disaggregateVolume(dividend, zero)).toThrowError();
      expect(() =>
        disaggregateVolume(dividend, negativeInteger)
      ).toThrowError();
      expect(() => disaggregateVolume(dividend, positiveFloat)).toThrowError();
      expect(() => disaggregateVolume(dividend, negativeFloat)).toThrowError();
      expect(() => disaggregateVolume(dividend, str)).toThrowError();
    });

    describe("Remainder === 0", () => {
      it("should return a list of Volume objects of equal 'volume' and same 'unit'", () => {
        const dividend = createConsumerUnit(100);
        const divisor = 5;
        const result = [
          { volume: 20, unit: "CU" },
          { volume: 20, unit: "CU" },
          { volume: 20, unit: "CU" },
          { volume: 20, unit: "CU" },
          { volume: 20, unit: "CU" }
        ];

        expect(disaggregateVolume(dividend, divisor)).toMatchObject(result);
      });
    });

    describe("Remainder > 0", () => {
      it("should return a list of ConsumerUnits with remainder (1) allocated as equally as possible", () => {
        const dividend = createConsumerUnit(6);
        const divisor = 5;
        const result = [
          { volume: 2, unit: "CU" },
          { volume: 1, unit: "CU" },
          { volume: 1, unit: "CU" },
          { volume: 1, unit: "CU" },
          { volume: 1, unit: "CU" }
        ];

        expect(disaggregateVolume(dividend, divisor)).toMatchObject(result);
      });

      it("should return a list of ConsumerUnits with remainder (2) allocated as equally as possible", () => {
        const dividend = createConsumerUnit(7);
        const divisor = 5;
        const result = [
          { volume: 2, unit: "CU" },
          { volume: 2, unit: "CU" },
          { volume: 1, unit: "CU" },
          { volume: 1, unit: "CU" },
          { volume: 1, unit: "CU" }
        ];

        expect(disaggregateVolume(dividend, divisor)).toMatchObject(result);
      });

      it("should return a list of ConsumerUnits with remainder (3) allocated as equally as possible", () => {
        const dividend = createConsumerUnit(8);
        const divisor = 5;
        const result = [
          { volume: 2, unit: "CU" },
          { volume: 2, unit: "CU" },
          { volume: 2, unit: "CU" },
          { volume: 1, unit: "CU" },
          { volume: 1, unit: "CU" }
        ];

        expect(disaggregateVolume(dividend, divisor)).toMatchObject(result);
      });

      it("should return a list of ConsumerUnits with remainder (4) allocated as equally as possible", () => {
        const dividend = createConsumerUnit(9);
        const divisor = 5;
        const result = [
          { volume: 2, unit: "CU" },
          { volume: 2, unit: "CU" },
          { volume: 2, unit: "CU" },
          { volume: 2, unit: "CU" },
          { volume: 1, unit: "CU" }
        ];

        expect(disaggregateVolume(dividend, divisor)).toMatchObject(result);
      });
    });
  });

  describe("Weightage-Spread", () => {
    it("should only accept ARRAY OF FLOATS between 0 and 1 (inclusive)", () => {
      return true;
    });
  });
});
