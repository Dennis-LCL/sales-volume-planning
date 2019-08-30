const { createBaseListPrice } = require("../src/domain/BaseListPrice");

describe("createBaseListPrice", () => {
  it("should only accept NON-ZERO POSITIVE NUMBER and a CURRENCY as parameters", () => {
    const amount = 2.56;
    const negativeNumber = -100;
    const zero = 0;
    const notANumber = "I'm Groot";
    const currency = "USD";

    expect(() => createBaseListPrice(amount, currency)).not.toThrowError();
    expect(() => createBaseListPrice(negativeNumber, currency)).toThrowError();
    expect(() => createBaseListPrice(zero, currency)).toThrowError();
    expect(() => createBaseListPrice(notANumber, currency)).toThrowError();
  });

  it("should create a valid Base List Price (BLP) object", () => {
    const amount = 2.56;
    const currency = "USD";
    const result = { amount: 2.56, currency: "USD" };

    expect(createBaseListPrice(amount, currency)).toMatchObject(result);
  });

  it("should make created BLP object immutable", () => {
    const baseListPrice = createBaseListPrice(100, "USD");
    const revisedBLP = createBaseListPrice(50, "AUD");

    baseListPrice.amount = 50;
    baseListPrice.currency = "AUD";

    expect(baseListPrice).not.toMatchObject(revisedBLP);
  });
});
