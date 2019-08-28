const {
  createConsumerUnit,
  aggregateVolume,
  disaggregateVolume,
  upliftVolume,
  upliftVolumeByAmount,
  deductVolume
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
      const dividend = createConsumerUnit(100);
      const zeroAndOne = [0.0, 1.0];
      const inRange = [0.5, 0.5];
      const outOfRange = [-0.5, -0.3, 1.8];
      const notANumber = ["I'm Groot", "I'm Groot", "I'm Groot"];

      expect(() => disaggregateVolume(dividend, zeroAndOne)).not.toThrowError();
      expect(() => disaggregateVolume(dividend, inRange)).not.toThrowError();
      expect(() => disaggregateVolume(dividend, outOfRange)).toThrowError();
      expect(() => disaggregateVolume(dividend, notANumber)).toThrowError();
    });

    it("should only accept ARRAY OF FLOATS sum up to 1", () => {
      const dividend = createConsumerUnit(100);
      const equalToOne = [0.0, 1.0];
      const largerThanOne = [0.5, 0.8];
      const lessThanOne = [0.5, 0.3];

      expect(() => disaggregateVolume(dividend, equalToOne)).not.toThrowError();
      expect(() => disaggregateVolume(dividend, largerThanOne)).toThrowError();
      expect(() => disaggregateVolume(dividend, lessThanOne)).toThrowError();
    });

    describe("PRODUCT is a POSITIVE INTEGER or ZERO after applying weightage", () => {
      it("should return a list of Volume objects by applying weightage x volume", () => {
        const dividend = createConsumerUnit(10);
        const divisor = [0.5, 0.3, 0.2];
        const result = [
          { volume: 5, unit: "CU" },
          { volume: 3, unit: "CU" },
          { volume: 2, unit: "CU" }
        ];

        expect(disaggregateVolume(dividend, divisor)).toMatchObject(result);
      });
    });

    describe("PRODUCT is a POSITIVE FLOAT after applying weightage", () => {
      it("should return a list of ConsumerUnits by rounding each element", () => {
        const dividend = createConsumerUnit(10);
        const divisor = [0.55, 0.24, 0.21];
        const result = [
          { volume: 6, unit: "CU" },
          { volume: 2, unit: "CU" },
          { volume: 2, unit: "CU" }
        ];

        expect(disaggregateVolume(dividend, divisor)).toMatchObject(result);
      });

      it("should return a list of ConsumerUnits sum up to dividend: SUM of Rounded ConsumerUnits = Dividend", () => {
        const dividend = createConsumerUnit(10);
        const divisor = [0.55, 0.25, 0.2];
        const result = [
          { volume: 6, unit: "CU" },
          { volume: 3, unit: "CU" },
          { volume: 1, unit: "CU" }
        ];

        expect(disaggregateVolume(dividend, divisor)).toMatchObject(result);
      });

      it("should return a list of ConsumerUnits sum up to dividend: SUM of Rounded ConsumerUnits > Dividend", () => {
        const dividend = createConsumerUnit(10);
        const divisor = [0.25, 0.25, 0.25, 0.25];
        const result = [
          { volume: 3, unit: "CU" },
          { volume: 3, unit: "CU" },
          { volume: 2, unit: "CU" },
          { volume: 2, unit: "CU" }
        ];

        expect(disaggregateVolume(dividend, divisor)).toMatchObject(result);
      });

      it("should return a list of ConsumerUnits sum up to dividend: SUM of Rounded ConsumerUnits < Dividend", () => {
        const dividend = createConsumerUnit(10);
        const divisor = [0.53, 0.33, 0.14];
        const result = [
          { volume: 6, unit: "CU" },
          { volume: 3, unit: "CU" },
          { volume: 1, unit: "CU" }
        ];

        expect(disaggregateVolume(dividend, divisor)).toMatchObject(result);
      });
    });
  });
});

describe("upliftVolumeByAmount", () => {
  it.only("should throw error if passed-in arguements are not valid Volume object and a positive integer", () => {
    const volumeObject = { volume: 100, unit: "CU" };
    const wrongObject1 = { value: 100, unit: "USD" }; // Invalid key (value)
    const wrongObject2 = { volume: 100, code: "USD" }; // Invalid key (code)
    const wrongObject3 = { volume: -100, unit: "USD" }; // Negative volume

    const adjustment = 100; // Positive Integer
    const zero = 0; // Zero
    const negInt = -10; // Negative Integer
    const posFloat = 10.5; // Positive Float
    const negFloat = -10.5; // Negative Float
    const str = "I'm Groot"; // Not A Number

    expect(() =>
      upliftVolumeByAmount(volumeObject, adjustment)
    ).not.toThrowError();
    expect(() => upliftVolumeByAmount(wrongObject1, adjustment)).toThrowError();
    expect(() => upliftVolumeByAmount(wrongObject2, adjustment)).toThrowError();
    expect(() => upliftVolumeByAmount(wrongObject3, adjustment)).toThrowError();
    expect(() => upliftVolumeByAmount(volumeObject, zero)).toThrowError();
    expect(() => upliftVolumeByAmount(volumeObject, negInt)).toThrowError();
    expect(() => upliftVolumeByAmount(volumeObject, posFloat)).toThrowError();
    expect(() => upliftVolumeByAmount(volumeObject, negFloat)).toThrowError();
    expect(() => upliftVolumeByAmount(volumeObject, str)).toThrowError();
  });

  it("should receive a Volume object and a positive integer and return the SUMMARY", () => {
    const cu = createConsumerUnit(100);
    const uplift = 50;
    const sum = createConsumerUnit(150);

    expect(upliftVolumeByAmount(cu, uplift)).toMatchObject(sum);
  });
});

describe("upliftVolume", () => {
  describe("uplift volume by passing in a Volume object", () => {
    it("should throw error if any pass-in arguement is NOT a Volume object", () => {
      const cu = createConsumerUnit(100);
      const str = "I'm Groot";
      const wrongObject1 = { value: 100, unit: "USD" }; // Invalid key (value)
      const wrongObject2 = { volume: 100, code: "USD" }; // Invalid key (code)
      const wrongObject3 = { volume: -100, unit: "USD" }; // Negative volume

      expect(() => upliftVolume(cu, str)).toThrowError();
      expect(() => upliftVolume(cu, wrongObject1)).toThrowError();
      expect(() => upliftVolume(cu, wrongObject2)).toThrowError();
      expect(() => upliftVolume(cu, wrongObject3)).toThrowError();
    });

    it("should throw error if any pass-in arguements have different 'unit' value", () => {
      const consumerUnit = { volume: 100, unit: "CU" };
      const caseUnit = { volume: 50, unit: "CS" };
      const statsUnit = { volume: 30, unit: "SU" };

      expect(() => upliftVolume(consumerUnit, caseUnit)).toThrowError();
      expect(() => upliftVolume(consumerUnit, statsUnit)).toThrowError();
    });

    it("should receive a Volume object and return the SUMMARY", () => {
      const cu = createConsumerUnit(100);
      const uplift = createConsumerUnit(50);
      const sum = createConsumerUnit(150);

      expect(upliftVolume(cu, uplift)).toMatchObject(sum);
    });
  });

  describe("uplift volume by passing in a Multiplier", () => {
    it("should throw error if uplift is NOT a number > 1", () => {
      const addend = createConsumerUnit(100);
      const notANumber = "I'm Groot";
      const numberLessThanOne = 0.5;
      const one = 1;

      expect(() => upliftVolume(addend, notANumber)).toThrowError();
      expect(() => upliftVolume(addend, numberLessThanOne)).toThrowError();
      expect(() => upliftVolume(addend, one)).toThrowError();
    });

    it("should receive a number larger than 1 and return the PRODUCT", () => {
      const cu = createConsumerUnit(100);
      const upliftMultiplier = 1.5;
      const product = createConsumerUnit(cu.volume * upliftMultiplier);

      expect(upliftVolume(cu, upliftMultiplier)).toMatchObject(product);
    });
  });
});

describe("deductVolume", () => {
  describe("deduct volume by passing in a Volume object", () => {
    it("should throw error if any pass-in arguement is NOT a Volume object", () => {
      const cu = createConsumerUnit(100);
      const str = "I'm Groot";
      const wrongObject1 = { value: 100, unit: "USD" }; // Invalid key (value)
      const wrongObject2 = { volume: 100, code: "USD" }; // Invalid key (code)
      const wrongObject3 = { volume: -100, unit: "USD" }; // Negative volume

      expect(() => deductVolume(cu, str)).toThrowError();
      expect(() => deductVolume(cu, wrongObject1)).toThrowError();
      expect(() => deductVolume(cu, wrongObject2)).toThrowError();
      expect(() => deductVolume(cu, wrongObject3)).toThrowError();
    });

    it("should receive a Volume object and return the DIFFERENCE", () => {
      const minuend = createConsumerUnit(100);
      const subtrahend = createConsumerUnit(80);
      const difference = createConsumerUnit(20);

      expect(deductVolume(minuend, subtrahend)).toMatchObject(difference);
    });

    it("should throw error if the Minuend is smaller than the Subtrahend", () => {
      const minuend = createConsumerUnit(70);
      const subtrahend = createConsumerUnit(100);

      expect(() => deductVolume(minuend, subtrahend)).toThrowError();
    });
  });

  describe("deduct volume by passing in a Multiplier", () => {
    it("should throw error if deduct is NOT a number between 0 and 1 (exclusive)", () => {
      const minuend = createConsumerUnit(100);
      const notANumber = "I'm Groot";
      const numberLargerThanOne = 1.5;
      const one = 1;
      const numberLessThanZero = -1.5;
      const zero = 0;

      expect(() => deductVolume(minuend, notANumber)).toThrowError();
      expect(() => deductVolume(minuend, numberLargerThanOne)).toThrowError();
      expect(() => deductVolume(minuend, one)).toThrowError();
      expect(() => deductVolume(minuend, numberLessThanZero)).toThrowError();
      expect(() => deductVolume(minuend, zero)).toThrowError();
    });

    it("should receive a number between 0 and 1 (exclusive) and return the PRODUCT", () => {
      const cu = createConsumerUnit(100);
      const deduct = 0.5;
      const product = createConsumerUnit(50);

      expect(deductVolume(cu, deduct)).toMatchObject(product);
    });
  });
});
