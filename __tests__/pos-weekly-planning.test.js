const disaggregatePosVolume = require("../src/pos-weekly-planning");

describe("Sales volume forecast for a plan with 1 SKU and 1 WEEK using POS:", () => {
  describe("Disaggregate weekly volume forecast to daily volume forecast using equal spread,", () => {
    describe("When total weekly volume forecast number is given,", () => {
      it("should return 7 equal daily volume when weekly volume is divisible by 7", () => {
        dailyPosVolume = [
          { dayOfWeek: 1, posVolume: 20 },
          { dayOfWeek: 2, posVolume: 20 },
          { dayOfWeek: 3, posVolume: 20 },
          { dayOfWeek: 4, posVolume: 20 },
          { dayOfWeek: 5, posVolume: 20 },
          { dayOfWeek: 6, posVolume: 20 },
          { dayOfWeek: 7, posVolume: 20 }
        ];
        expect(disaggregatePosVolume(140)).toMatchObject(dailyPosVolume);
      });

      it("should equally allocate the remainder (1) when weekly volume is NOT divisible by 7", () => {
        weeklyPosVolume = 8;
        dailyPosVolume = [
          { dayOfWeek: 1, posVolume: 2 },
          { dayOfWeek: 2, posVolume: 1 },
          { dayOfWeek: 3, posVolume: 1 },
          { dayOfWeek: 4, posVolume: 1 },
          { dayOfWeek: 5, posVolume: 1 },
          { dayOfWeek: 6, posVolume: 1 },
          { dayOfWeek: 7, posVolume: 1 }
        ];;
        expect(disaggregatePosVolume(weeklyPosVolume)).toMatchObject(
          dailyPosVolume
        );
      });

      it("should equally allocate the remainder (2) when weekly volume is NOT divisible by 7", () => {
        weeklyPosVolume = 9;
        dailyPosVolume = dailyPosVolume = [
          { dayOfWeek: 1, posVolume: 2 },
          { dayOfWeek: 2, posVolume: 2 },
          { dayOfWeek: 3, posVolume: 1 },
          { dayOfWeek: 4, posVolume: 1 },
          { dayOfWeek: 5, posVolume: 1 },
          { dayOfWeek: 6, posVolume: 1 },
          { dayOfWeek: 7, posVolume: 1 }
        ];;
        expect(disaggregatePosVolume(weeklyPosVolume)).toMatchObject(
          dailyPosVolume
        );
      });

      it("should equally allocate the remainder (4) when weekly volume is NOT divisible by 7", () => {
        weeklyPosVolume = 11;
        dailyPosVolume = dailyPosVolume = [
          { dayOfWeek: 1, posVolume: 2 },
          { dayOfWeek: 2, posVolume: 2 },
          { dayOfWeek: 3, posVolume: 2 },
          { dayOfWeek: 4, posVolume: 2 },
          { dayOfWeek: 5, posVolume: 1 },
          { dayOfWeek: 6, posVolume: 1 },
          { dayOfWeek: 7, posVolume: 1 }
        ];;
        expect(disaggregatePosVolume(weeklyPosVolume)).toMatchObject(
          dailyPosVolume
        );
      });

      it("should equally allocate the remainder (6) when weekly volume is NOT divisible by 7", () => {
        weeklyPosVolume = 13;
        dailyPosVolume = dailyPosVolume = [
          { dayOfWeek: 1, posVolume: 2 },
          { dayOfWeek: 2, posVolume: 2 },
          { dayOfWeek: 3, posVolume: 2 },
          { dayOfWeek: 4, posVolume: 2 },
          { dayOfWeek: 5, posVolume: 2 },
          { dayOfWeek: 6, posVolume: 2 },
          { dayOfWeek: 7, posVolume: 1 }
        ];;
        expect(disaggregatePosVolume(weeklyPosVolume)).toMatchObject(
          dailyPosVolume
        );
      });
    });

    describe("When % uplift on top of baseline volume is given,", () => {
      it("should return 7 equal daily volume when weekly volume is divisible by 7", () => {
        
      })
    })
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
