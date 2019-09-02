const { createConsumerUnit } = require("../src/domain/Volume");
const { createBaseListPrice } = require("../src/domain/BaseListPrice");
const { calculateGIV } = require("../src/domain/GIV");

describe("calculateGIV", () => {
  it("should only accept a Volume object and a BaseListPrice object as parameters", () => {
    const volume = createConsumerUnit(100);
    const wrongVolume1 = { value: 100, unit: "CU" }; // Invalid key (value)
    const wrongVolume2 = { volume: 100, code: "CU" }; // Invalid key (code)
    const wrongVolume3 = { volume: -100, unit: "CU" }; // Negative volume
    const blp = createBaseListPrice(2.56, "USD");
    const wrongBlp1 = { amt: 2.56, currency: "USD" }; // Invalid key (amt)
    const wrongBlp2 = { amount: 2.56, unit: "USD" }; // Invalid key (unit)
    const wrongBlp3 = { amount: -2.56, currency: "USD" }; // Negative amount
    const wrongBlp4 = { amount: 0, currency: "USD" }; // Zero amount

    expect(() => calculateGIV(volume, blp)).not.toThrowError();
    expect(() => calculateGIV(wrongVolume1, blp)).toThrowError();
    expect(() => calculateGIV(wrongVolume2, blp)).toThrowError();
    expect(() => calculateGIV(wrongVolume3, blp)).toThrowError();
    expect(() => calculateGIV(volume, wrongBlp1)).toThrowError();
    expect(() => calculateGIV(volume, wrongBlp2)).toThrowError();
    expect(() => calculateGIV(volume, wrongBlp3)).toThrowError();
    expect(() => calculateGIV(volume, wrongBlp4)).toThrowError();
  });

  it("should return a GIV object", () => {
    const volume = createConsumerUnit(100);
    const blp = createBaseListPrice(2.56, "USD");
    const result = { amount: 256, currency: "USD" };

    console.log(calculateGIV(volume, blp));
    expect(calculateGIV(volume, blp)).toMatchObject(result);
  });

  it("should make created GIV object immutable", () => {
    const volume = createConsumerUnit(100);
    const blp = createBaseListPrice(2.56, "USD");
    const giv = calculateGIV(volume, blp);
    const revisedGIV = { amount: 100, currency: "AUD" };

    giv.amount = 100;
    giv.currency = "AUD";

    expect(giv).not.toMatchObject(revisedGIV);
  });
});
