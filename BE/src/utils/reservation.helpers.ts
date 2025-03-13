import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { IAbonement } from '../db/models/abonement';
import { isToday, isTomorrow, timeZone } from '.';

export const isTrainingReserved = (abonement: any, training: any) => {
  return training.reservations.some(
    (reservation: any) =>
      reservation.user.toString() === abonement.user.toString(),
  );
};

export const activateAbonement = (
  abonement: IAbonement,
  trainingDate: Date,
) => {
  const activationDate = new Date(trainingDate);
  const expirationDate = new Date(activationDate);
  expirationDate.setMonth(activationDate.getMonth() + 1);
  abonement.activatedAt = activationDate;
  abonement.expiratedAt = expirationDate;
  abonement.status = 'active';
};

export const removeTraining = (trainings: any[], trainingId: any) => {
  return trainings.filter((t: any) => {
    const tId = t._id ? t._id.toString() : t.toString();
    return tId !== trainingId.toString();
  });
};

export function calculateHoursDiff(
  trainingTime: Date,
  currentTime: Date = toZonedTime(new Date(), timeZone),
): number {
  const diffInMilliseconds = trainingTime.getTime() - currentTime.getTime();
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
  return diffInHours;
}

export const canTrainingProceed = (
  trainingDate: string,
  visitorsCount: number,
): boolean => {
  const currentTime = new Date();
  // Convert time to the Kyiv timezone
  const kyivCurrentTime = toZonedTime(currentTime, timeZone);
  const trainingDateTime = toZonedTime(trainingDate, timeZone);
  const timeDifference = calculateHoursDiff(trainingDateTime, kyivCurrentTime);

  const isTrainingForTomorrowMorning =
    isTomorrow(trainingDateTime) &&
    [9, 10, 11, 12].includes(trainingDateTime.getHours());

  if (timeDifference < 3 && visitorsCount < 2) {
    return false; // Return training to user's subscription
  }
  if (
    kyivCurrentTime.getHours() >= 21 &&
    isTrainingForTomorrowMorning &&
    visitorsCount < 2
  ) {
    return false; // Return training to user's subscription
  }
  return true;
};

export function isCancellationForbidden(
  trainingDate: any,
  currentDate: any = new Date(),
): boolean {
  const kyivCurrentTime = toZonedTime(currentDate, timeZone);
  const kyivTrainingTime = toZonedTime(trainingDate, timeZone);

  // Get hours in Kyiv time
  const currentHour = Number(formatInTimeZone(currentDate, timeZone, 'HH'));
  const trainingHour = Number(formatInTimeZone(trainingDate, timeZone, 'HH'));

  const hoursDiff = calculateHoursDiff(kyivTrainingTime, kyivCurrentTime);
  const isEarlyMorningTraining = [9, 10, 11, 12].includes(trainingHour);
  const isLateReservationUpdate =
    currentHour >= 21 && isTomorrow(kyivTrainingTime);
  const isEarlyReservationUpdate = currentHour < 8 && isToday(kyivTrainingTime);

  return (
    hoursDiff < 3 ||
    (isEarlyMorningTraining && isEarlyReservationUpdate) ||
    (isEarlyMorningTraining && isLateReservationUpdate)
  );
}

export function reservationAccess(scheduledDate: Date, reservedPlaces: number) {
  const kyivCurrentTime = toZonedTime(new Date(), timeZone);
  const scheduledTime = toZonedTime(scheduledDate, timeZone);
  // Rule 1: If scheduled time has passed, reservation is closed
  if (kyivCurrentTime >= scheduledTime) {
    return false;
  }
  const currentHour = kyivCurrentTime.getHours();
  const hoursDiff = calculateHoursDiff(scheduledTime, kyivCurrentTime);
  const isEarlyMorningReservation = [9, 10, 11].includes(
    scheduledTime.getHours(),
  );
  const isLateReservationUpdate =
    currentHour >= 21 && isTomorrow(scheduledTime);
  const isEarlyReservationUpdate = currentHour < 8 && isToday(scheduledTime);

  // Rule 2: Client cannot reserve next day trainings scheduled at 9 a.m, 10 a.m, and 11 a.m after 9 p.m of the current day
  if (
    isLateReservationUpdate &&
    isEarlyMorningReservation &&
    reservedPlaces <= 1
  ) {
    return false;
  }

  // Rule 3: Not allowed to reserve morning trainings if there are less than two places reserved
  if (
    isEarlyReservationUpdate &&
    isEarlyMorningReservation &&
    reservedPlaces <= 1
  ) {
    return false;
  }

  // Rule 4: Client cannot reserve less than 3 hours before scheduled training
  if (hoursDiff <= 3 && reservedPlaces < 2) {
    return false;
  }

  // If none of the above conditions are met, reservation is allowed
  return true;
}

// export function isCancellationForbidden(
//   trainingDate: any,
//   currentTime: any = new Date(),
// ): boolean {
//   const kyivCurrentTime = toZonedTime(currentTime, timeZone);
//   const currentHour = kyivCurrentTime.getHours();
//   const trainingTime = toZonedTime(trainingDate, timeZone);
//   const hoursDiff = calculateHoursDiff(trainingTime, kyivCurrentTime);
//   const isEarlyMorningTraining = [9, 10, 11].includes(trainingTime.getHours());
//   const isLateReservationUpdate = currentHour >= 21 && isTomorrow(trainingTime);
//   const isEarlyReservationUpdate = currentHour < 8 && isToday(trainingTime);

//   return (
//     hoursDiff < 3 ||
//     (isEarlyMorningTraining && isEarlyReservationUpdate) ||
//     (isEarlyMorningTraining && isLateReservationUpdate)
//   );
// }
