const {
  disaggregateVolume,
  calculateTotalVolume
} = require("../src/pos-weekly-planning");

let baseline;
let uplift;
let method;

describe("FUNCTION: disaggregateVolume | disaggregate consumer unit volume from WEEKLY to DAILY", () => {
  describe("Disaggregate with EQUAL SPREAD method", () => {
    it("should return 7 equal daily volume when weekly volume is divisible by 7", () => {
      weeklyPosVolume = 140;
      dailyPosVolume = [
        { dayOfWeek: 1, volume: 20 },
        { dayOfWeek: 2, volume: 20 },
        { dayOfWeek: 3, volume: 20 },
        { dayOfWeek: 4, volume: 20 },
        { dayOfWeek: 5, volume: 20 },
        { dayOfWeek: 6, volume: 20 },
        { dayOfWeek: 7, volume: 20 }
      ];

      expect(disaggregateVolume(weeklyPosVolume)).toMatchObject(dailyPosVolume);
    });

    it("should equally allocate the remainder (1) when weekly volume is NOT divisible by 7", () => {
      weeklyPosVolume = 8;
      dailyPosVolume = [
        { dayOfWeek: 1, volume: 2 },
        { dayOfWeek: 2, volume: 1 },
        { dayOfWeek: 3, volume: 1 },
        { dayOfWeek: 4, volume: 1 },
        { dayOfWeek: 5, volume: 1 },
        { dayOfWeek: 6, volume: 1 },
        { dayOfWeek: 7, volume: 1 }
      ];

      expect(disaggregateVolume(weeklyPosVolume)).toMatchObject(dailyPosVolume);
    });

    it("should equally allocate the remainder (2) when weekly volume is NOT divisible by 7", () => {
      weeklyPosVolume = 9;
      dailyPosVolume = dailyPosVolume = [
        { dayOfWeek: 1, volume: 2 },
        { dayOfWeek: 2, volume: 2 },
        { dayOfWeek: 3, volume: 1 },
        { dayOfWeek: 4, volume: 1 },
        { dayOfWeek: 5, volume: 1 },
        { dayOfWeek: 6, volume: 1 },
        { dayOfWeek: 7, volume: 1 }
      ];

      expect(disaggregateVolume(weeklyPosVolume)).toMatchObject(dailyPosVolume);
    });

    it("should equally allocate the remainder (4) when weekly volume is NOT divisible by 7", () => {
      weeklyPosVolume = 11;
      dailyPosVolume = dailyPosVolume = [
        { dayOfWeek: 1, volume: 2 },
        { dayOfWeek: 2, volume: 2 },
        { dayOfWeek: 3, volume: 2 },
        { dayOfWeek: 4, volume: 2 },
        { dayOfWeek: 5, volume: 1 },
        { dayOfWeek: 6, volume: 1 },
        { dayOfWeek: 7, volume: 1 }
      ];

      expect(disaggregateVolume(weeklyPosVolume)).toMatchObject(dailyPosVolume);
    });

    it("should equally allocate the remainder (6) when weekly volume is NOT divisible by 7", () => {
      weeklyPosVolume = 13;
      dailyPosVolume = dailyPosVolume = [
        { dayOfWeek: 1, volume: 2 },
        { dayOfWeek: 2, volume: 2 },
        { dayOfWeek: 3, volume: 2 },
        { dayOfWeek: 4, volume: 2 },
        { dayOfWeek: 5, volume: 2 },
        { dayOfWeek: 6, volume: 2 },
        { dayOfWeek: 7, volume: 1 }
      ];

      expect(disaggregateVolume(weeklyPosVolume)).toMatchObject(dailyPosVolume);
    });

    it("should return 7 equal daily volume when weekly volume is divisible by 7", () => {
      baseline = 100;
      uplift = 1.4;
      method = "percentage";
      dailyPosVolume = [
        { dayOfWeek: 1, volume: 20 },
        { dayOfWeek: 2, volume: 20 },
        { dayOfWeek: 3, volume: 20 },
        { dayOfWeek: 4, volume: 20 },
        { dayOfWeek: 5, volume: 20 },
        { dayOfWeek: 6, volume: 20 },
        { dayOfWeek: 7, volume: 20 }
      ];

      expect(
        disaggregateVolume(calculateTotalVolume(baseline, uplift, method))
      ).toMatchObject(dailyPosVolume);
    });
  });

  describe("When incremental sales volume on top of baseline volume is given,", () => {});
});

describe("FUNCTION: calculateTotalVolume | calculate total volume with BASELINE and volume UPLIFT", () => {
  describe("Volume UPLIFT as a 'percentage' applied on Baseline Volume", () => {
    it("should NOT round the Total Volume when the calculation result is a whole number", () => {
      baseline = 100;
      uplift = 1.5;
      method = "percentage";

      expect(calculateTotalVolume(baseline, uplift, method)).toBe(150);
    });

    it("should round the Total Volume when the calculation result is a float number (round up)", () => {
      baseline = 100;
      uplift = 2.005;
      method = "percentage";

      expect(calculateTotalVolume(baseline, uplift, method)).toBe(201);
    });

    it("should round the Total Volume when the calculation result is a float number (round down)", () => {
      baseline = 100;
      uplift = 2.004;
      method = "percentage";

      expect(calculateTotalVolume(baseline, uplift, method)).toBe(200);
    });
  });

  describe("Volume UPLIFT as 'absolute' incremental volume on top of Baseline Volume", () => {
    it("should return Total Volume as Baseline Volume + Incremental Sales Volume", () => {
      baseline = 100;
      uplift = 110;
      method = "absolute";

      expect(calculateTotalVolume(baseline, uplift, method)).toBe(210);
    });
  });

  describe("Invalid function parameters", () => {
    it("should throw an error when METHOD is NOT 'absolute' or 'percentage'", () => {
      baseline = 100;
      uplift = 110;
      method = "giberrish";

      expect(() => {
        calculateTotalVolume(baseline, uplift, method);
      }).toThrowError();
    });

    it("should throw an error when METHOD is 'absolute' and UPLIFT receives FLOAT number", () => {
      baseline = 100;
      uplift = 110.5;
      method = "absolute";

      expect(() => {
        calculateTotalVolume(baseline, uplift, method);
      }).toThrowError();
    });

    it("should throw an error when METHOD is 'absolute' and UPLIFT receives NEGATIVE number", () => {
      baseline = 100;
      uplift = -30;
      method = "absolute";

      expect(() => {
        calculateTotalVolume(baseline, uplift, method);
      }).toThrowError();
    });

    it("should throw an error when METHOD is 'percentage' and BASELINE receives FLOAT number", () => {
      baseline = -100.5;
      uplift = 30;
      method = "percentage";

      expect(() => {
        calculateTotalVolume(baseline, uplift, method);
      }).toThrowError();
    });

    it("should throw an error when METHOD is 'percentage' and BASELINE receives NEGATIVE number", () => {
      baseline = -100;
      uplift = 30;
      method = "percentage";

      expect(() => {
        calculateTotalVolume(baseline, uplift, method);
      }).toThrowError();
    });

    it("should throw an error when METHOD is 'percentage' and UPLIFT receives number LESS THAN 1", () => {
      baseline = 100;
      uplift = 0.9;
      method = "percentage";

      expect(() => {
        calculateTotalVolume(baseline, uplift, method);
      }).toThrowError();
    });
  });
});

/*
GIVEN
A Sales AE choose to plan sales volume

- using POS consumer unit as the unit-of-measure, and
- forecast weekly sales volume for each SKU,

WHEN
Sales AE complete the sales volume forecast for all 52 weeks in a Fiscal-Year 
for an SKU using any one or any combinations of below methods and press confirm
/ save:

- forecast weekly sales volume by inputting a total sales volume number,
- forecast weekly sales volume by inputting a % uplift on top of the SKU's
weekly baseline sales volume,
- forecast weekly sales volume by inputting an incremental sales volume number 
on top of baseline sales volume,

THEN
The system should persist Sales AE's full 52-week plan and

- Allocate weekly sales volume forecast into daily sales volume forecast
- Aggregate weekly sales volume forecast into monthly sales volume forecast
- Aggregate weekly sales volume forecast into quarterly sales volume forecast
- Aggregate weekly sales volume forecast into semester sales volume forecast
- Aggregate weekly sales volume forecast into annual sales volume forecast
- Display sales volume forecast at daily, weekly, monthly, quarterly, semester,
  and annual aggregation to Sales AE for confirmation
*/
