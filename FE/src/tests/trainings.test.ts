import {
  calculateHoursDiff,
  // isCancellationForbidden,
  reservationAccess,
} from "../utils/trainings";

describe("--- calculateHoursDiff ---", () => {
  it("should correctly calculate the difference in hours between two dates", () => {
    const currentTime = new Date("2023-10-10T10:00:00Z");
    const trainingTime = new Date("2023-10-10T13:00:00Z");
    const diff = calculateHoursDiff(currentTime, trainingTime);
    expect(diff).toBe(3);
  });

  it("should return a negative difference if the current time is after the training time", () => {
    const currentTime = new Date("2023-10-10T13:00:00Z");
    const trainingTime = new Date("2023-10-10T10:00:00Z");
    const diff = calculateHoursDiff(currentTime, trainingTime);
    expect(diff).toBe(-3);
  });
});

describe("--- reservationAccess ---", () => {
  it("should return false if the scheduled time has passed", () => {
    const currentTime = new Date("2023-10-10T13:00:00Z");
    const trainingTime = new Date("2023-10-10T10:00:00Z");
    const access = reservationAccess(currentTime, trainingTime, 5, -3);
    expect(access).toBe(false);
  });

  it("should return false if trying to reserve next day training at 9 a.m. after 9 p.m. of the current day", () => {
    const currentTime = new Date("2024-12-30T21:30:00Z");
    const trainingTime = new Date("2024-12-31T09:00:00Z");
    const access = reservationAccess(currentTime, trainingTime, 1, 11.5);
    expect(access).toBe(false);
  });

  it("should return false if trying to reserve less than 3 hours before the scheduled training with less than two places reserved", () => {
    const currentTime = new Date("2023-10-10T07:00:00Z");
    const trainingTime = new Date("2023-10-10T09:00:00Z");
    const access = reservationAccess(currentTime, trainingTime, 1, 2);
    expect(access).toBe(false);
  });

  it("should return false if trying to reserve morning training before 8 a.m. with less than two places reserved", () => {
    const currentTime = new Date("2023-10-10T07:00:00Z");
    const trainingTime = new Date("2023-10-10T09:00:00Z");
    const access = reservationAccess(currentTime, trainingTime, 1, 2);
    expect(access).toBe(false);
  });

  it("should return true if hours diff <= 3 and reserved places >= 2", () => {
    const currentTime = new Date("2023-10-10T07:00:00Z");
    const trainingTime = new Date("2023-10-10T09:00:00Z");
    const access = reservationAccess(currentTime, trainingTime, 2, 2);
    expect(access).toBe(true);
  });

  it("should return true if none of the conditions are met", () => {
    const currentTime = new Date("2023-10-10T07:00:00Z");
    const trainingTime = new Date("2023-10-10T10:00:00Z");
    const access = reservationAccess(currentTime, trainingTime, 5, 3);
    expect(access).toBe(true);
  });
});

// describe("--- isCancellationForbidden ---", () => {
//   it("should return true if updateType is 'cancellation' and hoursDiff < 3", () => {
//     const currentTime = new Date("2023-10-10T07:00:00Z");
//     const trainingTime = new Date("2023-10-10T09:00:00Z");
//     const result = isCancellationForbidden(
//       "cancellation",
//       2,
//       currentTime,
//       trainingTime
//     );
//     expect(result).toBe(true);
//   });

//   it("should return true if updateType is 'cancellation' and it's late reservation update for early morning training", () => {
//     const currentTime = new Date("2024-12-30T21:30:00Z");
//     const trainingTime = new Date("2024-12-31T09:00:00Z");
//     const result = isCancellationForbidden(
//       "cancellation",
//       11.5,
//       currentTime,
//       trainingTime
//     );
//     expect(result).toBe(true);
//   });

//   it("should return true if updateType is 'cancellation' and it's early reservation update for early morning training", () => {
//     const currentTime = new Date("2023-10-10T07:00:00Z");
//     const trainingTime = new Date("2023-10-10T09:00:00Z");
//     const result = isCancellationForbidden(
//       "cancellation",
//       2,
//       currentTime,
//       trainingTime
//     );
//     expect(result).toBe(true);
//   });

//   it("should return false if updateType is 'cancellation' and none of the conditions are met", () => {
//     const currentTime = new Date("2023-10-10T10:00:00Z");
//     const trainingTime = new Date("2023-10-10T13:00:00Z");
//     const result = isCancellationForbidden(
//       "cancellation",
//       3,
//       currentTime,
//       trainingTime
//     );
//     expect(result).toBe(false);
//   });

//   it("should return false if updateType is not 'cancellation'", () => {
//     const currentTime = new Date("2023-10-10T10:00:00Z");
//     const trainingTime = new Date("2023-10-10T13:00:00Z");
//     const result = isCancellationForbidden(
//       "reservation",
//       3,
//       currentTime,
//       trainingTime
//     );
//     expect(result).toBe(false);
//   });
// });
