const {
  createVolume,
  aggregateVolume,
  disaggregateVolume,
  upliftVolumeByAmount,
  upliftVolumeByPercentage,
  deductVolumeByAmount,
  deductVolumeByPercentage
} = require("../src/domain/Volume");

describe("createVolume", () => {
  describe("create a ConsumerUnit Volume object", () => {
    it("should only accept an INTEGER and a UNIT (CU) as parameters", () => {
      const posInt = 100;
      const negInt = -100;
      const zero = 0;
      const posFlt = 10.5;
      const negFlt = -10.5;
      const str = "I'm Groot";
      const matchedUnit = "CU";
      const misMatchedUnit = "SU";
      const nonStrUnit = 100;

      expect(() => createVolume(posInt, matchedUnit)).not.toThrowError();
      expect(() => createVolume(negInt, matchedUnit)).not.toThrowError();
      expect(() => createVolume(zero, matchedUnit)).not.toThrowError();
      expect(() => createVolume(posFlt, matchedUnit)).toThrowError();
      expect(() => createVolume(negFlt, matchedUnit)).toThrowError();
      expect(() => createVolume(str, matchedUnit)).toThrowError();
      expect(() => createVolume(posInt, misMatchedUnit)).toThrowError();
      expect(() => createVolume(posInt, nonStrUnit)).toThrowError();
    });

    it("should return a Volume object with Unit === 'CU'", () => {
      const result = { volume: 100, unit: "CU" };

      expect(createVolume(100, "CU")).toMatchObject(result);
    });

    it("should make created Volume object immutable", () => {
      const cu = createVolume(100, "CU");
      const volumeObject = { volume: 50, unit: "CS" };
      cu.volume = 50;
      cu.unit = "CS";
      expect(cu).not.toMatchObject(volumeObject);
    });
  });

  describe("create a Case Volume object", () => {
    it("should only accept a NUMBER and a UNIT (CS) as parameters", () => {
      const posInt = 100;
      const negInt = -100;
      const zero = 0;
      const posFlt = 10.5;
      const negFlt = -10.5;
      const str = "I'm Groot";
      const matchedUnit = "CS";
      const misMatchedUnit = "SU";
      const nonStrUnit = 100;

      expect(() => createVolume(posInt, matchedUnit)).not.toThrowError();
      expect(() => createVolume(negInt, matchedUnit)).not.toThrowError();
      expect(() => createVolume(zero, matchedUnit)).not.toThrowError();
      expect(() => createVolume(posFlt, matchedUnit)).not.toThrowError();
      expect(() => createVolume(negFlt, matchedUnit)).not.toThrowError();
      expect(() => createVolume(str, matchedUnit)).toThrowError();
      expect(() => createVolume(posInt, misMatchedUnit)).toThrowError();
      expect(() => createVolume(posInt, nonStrUnit)).toThrowError();
    });

    it("should return a Volume object with Unit === 'CS'", () => {
      const result = { volume: 100, unit: "CS" };

      expect(createVolume(100, "CS")).toMatchObject(result);
    });

    it("should make created Volume object immutable", () => {
      const cs = createVolume(100, "CS");
      const volumeObject = { volume: 50, unit: "CS" };
      cs.volume = 50;
      cs.unit = "CS";
      expect(cs).not.toMatchObject(volumeObject);
    });
  });
});

describe("aggregateVolume", () => {
  describe("aggregate ConsumerUnit Volume object", () => {
    it("should aggregate 'volume' of 2 Volume objects of the same 'unit", () => {
      const cu1 = createVolume(100, "CU");
      const cu2 = createVolume(50, "CU");
      const expectedVolume = createVolume(150, "CU");

      expect(aggregateVolume(cu1, cu2)).toMatchObject(expectedVolume);
    });

    it("should aggregate 'volume' of 3 Volume objects of the same 'unit", () => {
      const cu1 = createVolume(100, "CU");
      const cu2 = createVolume(50, "CU");
      const cu3 = createVolume(30, "CU");
      const expectedVolume = createVolume(180, "CU");

      expect(aggregateVolume(cu1, cu2, cu3)).toMatchObject(expectedVolume);
    });

    it("should aggregate 'volume' of Volume objects of positive/negative/zero volume", () => {
      const cuPositive = createVolume(100, "CU");
      const cuNegative = createVolume(-50, "CU");
      const cuZero = createVolume(0, "CU");
      const expectedVolume = createVolume(50, "CU");

      expect(aggregateVolume(cuPositive, cuNegative, cuZero)).toMatchObject(
        expectedVolume
      );
    });

    it("should throw error if any pass-in arguement is NOT a Volume object", () => {
      const cu = createVolume(100, "CU");
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
});

describe("disaggregateVolume", () => {
  describe("Equal-Spread", () => {
    it("should only accept POSITIVE INTEGER as parameter", () => {
      const dividend = createVolume(100, "CU");
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
        const dividend = createVolume(100, "CU");
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
        const dividend = createVolume(6, "CU");
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
        const dividend = createVolume(7, "CU");
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
        const dividend = createVolume(8, "CU");
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
        const dividend = createVolume(9, "CU");
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
      const dividend = createVolume(100, "CU");
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
      const dividend = createVolume(100, "CU");
      const equalToOne = [0.0, 1.0];
      const largerThanOne = [0.5, 0.8];
      const lessThanOne = [0.5, 0.3];

      expect(() => disaggregateVolume(dividend, equalToOne)).not.toThrowError();
      expect(() => disaggregateVolume(dividend, largerThanOne)).toThrowError();
      expect(() => disaggregateVolume(dividend, lessThanOne)).toThrowError();
    });

    describe("PRODUCT is a POSITIVE INTEGER or ZERO after applying weightage", () => {
      it("should return a list of Volume objects by applying weightage x volume", () => {
        const dividend = createVolume(10, "CU");
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
        const dividend = createVolume(10, "CU");
        const divisor = [0.55, 0.24, 0.21];
        const result = [
          { volume: 6, unit: "CU" },
          { volume: 2, unit: "CU" },
          { volume: 2, unit: "CU" }
        ];

        expect(disaggregateVolume(dividend, divisor)).toMatchObject(result);
      });

      it("should return a list of ConsumerUnits sum up to dividend: SUM of Rounded ConsumerUnits = Dividend", () => {
        const dividend = createVolume(10, "CU");
        const divisor = [0.55, 0.25, 0.2];
        const result = [
          { volume: 6, unit: "CU" },
          { volume: 3, unit: "CU" },
          { volume: 1, unit: "CU" }
        ];

        expect(disaggregateVolume(dividend, divisor)).toMatchObject(result);
      });

      it("should return a list of ConsumerUnits sum up to dividend: SUM of Rounded ConsumerUnits > Dividend", () => {
        const dividend = createVolume(10, "CU");
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
        const dividend = createVolume(10, "CU");
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
  it("should throw error if passed-in arguements are not valid Volume object and a positive integer", () => {
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
    const cu = createVolume(100, "CU");
    const uplift = 50;
    const sum = createVolume(150, "CU");

    expect(upliftVolumeByAmount(cu, uplift)).toMatchObject(sum);
  });
});

describe("upliftVolumeByPercentage", () => {
  it("should throw error if passed-in arguements are not valid Volume object and a number > 1", () => {
    const vo = { volume: 100, unit: "CU" };
    const badObj1 = { value: 100, unit: "USD" }; // Invalid key (value)
    const badObj2 = { volume: 100, code: "USD" }; // Invalid key (code)
    const badObj3 = { volume: -100, unit: "USD" }; // Negative volume

    const intAdj = 100; // Integer > 1
    const fltAdj = 1.5; // Float > 1
    const zero = 0; // Zero
    const one = 1; // One
    const negInt = -10; // Negative Integer
    const negFlt = -10.5; // Negative Float
    const smFlt = 0.5; // Positive Float < 1
    const str = "I'm Groot"; // Not A Number

    expect(() => upliftVolumeByPercentage(vo, intAdj)).not.toThrowError();
    expect(() => upliftVolumeByPercentage(vo, fltAdj)).not.toThrowError();
    expect(() => upliftVolumeByPercentage(badObj1, intAdj)).toThrowError();
    expect(() => upliftVolumeByPercentage(badObj2, intAdj)).toThrowError();
    expect(() => upliftVolumeByPercentage(badObj3, intAdj)).toThrowError();
    expect(() => upliftVolumeByPercentage(vo, zero)).toThrowError();
    expect(() => upliftVolumeByPercentage(vo, one)).toThrowError();
    expect(() => upliftVolumeByPercentage(vo, negInt)).toThrowError();
    expect(() => upliftVolumeByPercentage(vo, negFlt)).toThrowError();
    expect(() => upliftVolumeByPercentage(vo, smFlt)).toThrowError();
    expect(() => upliftVolumeByPercentage(vo, str)).toThrowError();
  });

  it("should receive a Volume object and a number > 1 and return the PRODUCT", () => {
    const cu = createVolume(100, "CU");
    const uplift = 1.5;
    const product = createVolume(150, "CU");

    expect(upliftVolumeByPercentage(cu, uplift)).toMatchObject(product);
  });
});

describe("deductVolumeByAmount", () => {
  it("should throw error if passed-in arguements are not valid Volume object and a positive integer", () => {
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
      deductVolumeByAmount(volumeObject, adjustment)
    ).not.toThrowError();
    expect(() => deductVolumeByAmount(wrongObject1, adjustment)).toThrowError();
    expect(() => deductVolumeByAmount(wrongObject2, adjustment)).toThrowError();
    expect(() => deductVolumeByAmount(wrongObject3, adjustment)).toThrowError();
    expect(() => deductVolumeByAmount(volumeObject, zero)).toThrowError();
    expect(() => deductVolumeByAmount(volumeObject, negInt)).toThrowError();
    expect(() => deductVolumeByAmount(volumeObject, posFloat)).toThrowError();
    expect(() => deductVolumeByAmount(volumeObject, negFloat)).toThrowError();
    expect(() => deductVolumeByAmount(volumeObject, str)).toThrowError();
  });

  it("should throw error if volume is not sufficient for deduction", () => {
    const cu = createVolume(100, "CU");
    const deductToZero = 100;
    const deductMoreThanCU = 120;

    expect(() => deductVolumeByAmount(cu, deductToZero)).not.toThrowError();
    expect(() => deductVolumeByAmount(cu, deductMoreThanCU)).toThrowError();
  });

  it("should receive a Volume object and a positive integer and return the DIFFERENCE", () => {
    const cu = createVolume(100, "CU");
    const deduct = 80;
    const difference = createVolume(20, "CU");

    expect(deductVolumeByAmount(cu, deduct)).toMatchObject(difference);
  });
});

describe("deductVolumeByPercentage", () => {
  it("should throw error if passed-in arguements are not valid Volume object and a number btw. 0 and 1 (exclusive)", () => {
    const vo = { volume: 100, unit: "CU" };
    const badObj1 = { value: 100, unit: "USD" }; // Invalid key (value)
    const badObj2 = { volume: 100, code: "USD" }; // Invalid key (code)
    const badObj3 = { volume: -100, unit: "USD" }; // Negative volume

    const inRange = 0.5; // Number btw. 0 and 1 (exclusive)
    const outOfRange1 = -1.5; // Number < 0
    const outOfRange2 = 1.5; // Number > 1
    const zero = 0; // Zero
    const one = 1; // One
    const str = "I'm Groot"; // Not A Number

    expect(() => deductVolumeByPercentage(vo, inRange)).not.toThrowError();
    expect(() => deductVolumeByPercentage(badObj1, inRange)).toThrowError();
    expect(() => deductVolumeByPercentage(badObj2, inRange)).toThrowError();
    expect(() => deductVolumeByPercentage(badObj3, inRange)).toThrowError();
    expect(() => deductVolumeByPercentage(vo, outOfRange1)).toThrowError();
    expect(() => deductVolumeByPercentage(vo, outOfRange2)).toThrowError();
    expect(() => deductVolumeByPercentage(vo, zero)).toThrowError();
    expect(() => deductVolumeByPercentage(vo, one)).toThrowError();
    expect(() => deductVolumeByPercentage(vo, str)).toThrowError();
  });

  it("should receive a Volume object and a number btw. 0 and 1 (exclusive) and return the PRODUCT", () => {
    const cu = createVolume(100, "CU");
    const deduct = 0.5;
    const product = createVolume(50, "CU");

    expect(deductVolumeByPercentage(cu, deduct)).toMatchObject(product);
  });
});
