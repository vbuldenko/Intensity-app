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

  const res =
    hoursDiff < 3 ||
    (isEarlyMorningTraining && isEarlyReservationUpdate) ||
    (isEarlyMorningTraining && isLateReservationUpdate);

  // #region cancellation check log
  console.log('\n========== CANCELLATION CHECK ==========');
  console.log('\x1b[36m%s\x1b[0m', 'TIMES (Kyiv):');
  console.log('Current time: \x1b[33m%s\x1b[0m', kyivCurrentTime);
  console.log('Training time: \x1b[33m%s\x1b[0m', kyivTrainingTime);
  console.log('\n\x1b[36m%s\x1b[0m', 'HOURS:');
  console.log('Current hour: \x1b[33m%s\x1b[0m', currentHour);
  console.log('Training hour: \x1b[33m%s\x1b[0m', trainingHour);
  console.log('Hours difference: \x1b[33m%s\x1b[0m', hoursDiff.toFixed(2));
  console.log('\n\x1b[36m%s\x1b[0m', 'CONDITIONS:');
  console.log(
    'Is late reservation update: \x1b[33m%s\x1b[0m',
    isLateReservationUpdate,
  );
  console.log(
    'Is early reservation update: \x1b[33m%s\x1b[0m',
    isEarlyReservationUpdate,
  );
  console.log('\n\x1b[36m%s\x1b[0m', 'TODAY CHECKS:');
  console.log('Is current date today: \x1b[33m%s\x1b[0m', isToday(currentDate));
  console.log(
    'Is kyiv current time today: \x1b[33m%s\x1b[0m',
    isToday(kyivCurrentTime),
  );
  console.log(
    'Is training date today: \x1b[33m%s\x1b[0m',
    isToday(trainingDate),
  );
  console.log(
    'Is kyiv training time today: \x1b[33m%s\x1b[0m',
    isToday(kyivTrainingTime),
  );
  console.log('\n\x1b[36m%s\x1b[0m', 'RESULT:');
  console.log(
    'Cancellation forbidden: \x1b[' + (res ? '31m' : '32m') + '%s\x1b[0m',
    res,
  );
  console.log('====================================\n');
  // #endregion

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
