const { createConsumerUnit, aggregateVolume } = require("../src/domain/Volume");

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
