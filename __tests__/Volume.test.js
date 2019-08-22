const { createConsumerUnit } = require("../src/domain/Volume");

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
