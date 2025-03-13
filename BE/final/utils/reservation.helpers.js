import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { isToday, isTomorrow, timeZone } from './index.js';

export const isTrainingReserved = (abonement, training) => {
  return training.reservations.some(
    reservation => reservation.user.toString() === abonement.user.toString(),
  );
};
export const activateAbonement = (abonement, trainingDate) => {
  const activationDate = new Date(trainingDate);
  const expirationDate = new Date(activationDate);
  expirationDate.setMonth(activationDate.getMonth() + 1);
  abonement.activatedAt = activationDate;
  abonement.expiratedAt = expirationDate;
  abonement.status = 'active';
};
export const removeTraining = (trainings, trainingId) => {
  return trainings.filter(t => {
    const tId = t._id ? t._id.toString() : t.toString();
    return tId !== trainingId.toString();
  });
};
export function calculateHoursDiff(
  trainingTime,
  currentTime = toZonedTime(new Date(), timeZone),
) {
  const diffInMilliseconds = trainingTime.getTime() - currentTime.getTime();
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
  return diffInHours;
}
export const canTrainingProceed = (trainingDate, visitorsCount) => {
  const kyivCurrentTime = toZonedTime(new Date(), timeZone);
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

// export function isCancellationForbidden(trainingDate) {
//   const kyivCurrentTime = toZonedTime(new Date(), timeZone);
//   console.log('kyivCurrentTime', kyivCurrentTime);
//   const trainingTime = toZonedTime(trainingDate, timeZone);
//   console.log('trainingTime', trainingTime);
//   const hoursDiff = calculateHoursDiff(trainingTime, kyivCurrentTime);
//   const currentHour = kyivCurrentTime.getHours();
//   const isEarlyMorningTraining = [9, 10, 11].includes(trainingTime.getHours());
//   const isLateReservationUpdate = currentHour >= 21 && isTomorrow(trainingTime);
//   const isEarlyReservationUpdate = currentHour < 8 && isToday(trainingTime);

//   return (
//     hoursDiff < 3 ||
//     (isLateReservationUpdate && isEarlyMorningTraining) ||
//     (isEarlyReservationUpdate && isEarlyMorningTraining)
//   );
// }

export function isCancellationForbidden(
  trainingDate,
  currentDate = new Date(),
) {
  console.log('currentDate', new Date());
  const kyivCurrentTime = toZonedTime(currentDate, timeZone);
  console.log('kyivCurrentTime', kyivCurrentTime);
  const kyivTrainingTime = toZonedTime(trainingDate, timeZone);
  console.log('kyivTrainingTime', kyivTrainingTime);

  // Get hours in Kyiv time
  const currentHour = Number(formatInTimeZone(currentDate, timeZone, 'HH'));
  const trainingHour = Number(formatInTimeZone(trainingDate, timeZone, 'HH'));
  console.log('currentHour', currentHour);
  console.log('trainingHour', trainingHour);

  const hoursDiff = calculateHoursDiff(kyivTrainingTime, kyivCurrentTime);
  const isEarlyMorningTraining = [9, 10, 11, 12].includes(trainingHour);
  console.log('isEarlyMorningTraining', isEarlyMorningTraining);
  const isLateReservationUpdate =
    currentHour >= 21 && isTomorrow(kyivTrainingTime);
  console.log('isLateReservationUpdate', isLateReservationUpdate);
  const isEarlyReservationUpdate = currentHour < 8 && isToday(kyivTrainingTime);
  console.log('isEarlyReservationUpdate', isEarlyReservationUpdate);
  console.log('isToday(currentDate)', isToday(currentDate));
  console.log(
    'is training date today',
    isToday(kyivTrainingTime),
    isToday(trainingDate),
  );

  const res =
    hoursDiff < 3 ||
    (isEarlyMorningTraining && isEarlyReservationUpdate) ||
    (isEarlyMorningTraining && isLateReservationUpdate);

  console.log('isCancellationForbidden', res);

  return res;
}

export function reservationAccess(scheduledDate, reservedPlaces) {
  const kyivCurrentTime = toZonedTime(new Date(), timeZone);
  const scheduledTime = toZonedTime(scheduledDate, timeZone);

  // Rule 1
  if (kyivCurrentTime >= scheduledTime) {
    console.log('Scheduled time is in the past');
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

  // Rule 2
  if (
    isLateReservationUpdate &&
    isEarlyMorningReservation &&
    reservedPlaces <= 1
  ) {
    console.log('Late reservation update for early morning training');
    return false;
  }

  // Rule 3
  if (
    isEarlyReservationUpdate &&
    isEarlyMorningReservation &&
    reservedPlaces <= 1
  ) {
    console.log('Early reservation update for early morning training');
    return false;
  }

  // Rule 4
  if (hoursDiff <= 3 && reservedPlaces < 2) {
    console.log('Less than 3 hours left for training');
    return false;
  }

  return true;
}
