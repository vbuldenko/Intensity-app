import bcrypt from 'bcrypt';
import { ApiError } from '../exceptions/api.error';
import { Request } from 'express';
import { UserDTO } from '../db/models/user';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { timeZone } from './trainingInitiator';
import { isToday, isTomorrow } from 'date-fns';

export function validateIdentifier(identifier: string): string | undefined {
  if (identifier.includes('@')) {
    return validateEmail(identifier);
  } else if (/^\d+$/.test(identifier)) {
    return validatePhone(identifier);
  } else {
    return 'Input data should be email or phone number';
  }
}

export function validateEmail(email: string): string | undefined {
  const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

  if (!email) {
    return 'Email is required';
  }

  if (!emailPattern.test(email)) {
    return 'Email is not valid';
  }
}

export function validatePhone(phone: string): string | undefined {
  // const phonePattern = /^380\d{9}$/;

  if (!phone) {
    return 'Phone is required';
  }

  // if (!phonePattern.test(phone)) {
  //   return 'Phone number must start with 380 and be followed by 9 digits';
  // }

  // if (phone.length !== 12) {
  //   return 'Phone number should be exactly 12 characters long';
  // }
}

export function validatePassword(password: string): string | undefined {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 4) {
    return 'Should be at least 6 characters';
  }
}

export function validateName(value: string): string | undefined {
  if (!value) {
    return 'Shold not be empty';
  }

  if (!value || value.length < 3) {
    return 'Should be at least 3 characters';
  }
}

export function hashPassword(
  password: string,
  saltRounds: number = 10,
): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

export const comparePasswords = (
  plainPWD: string,
  userPWDHash: string,
): Promise<boolean> => {
  return bcrypt.compare(plainPWD, userPWDHash);
};

export function calculateHoursDiff(
  trainingTime: Date,
  currentTime: Date = toZonedTime(new Date(), timeZone),
): number {
  const diffInMilliseconds = trainingTime.getTime() - currentTime.getTime();
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
  return diffInHours;
}

// export function isTomorrow(dateToCheck: Date) {
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);
//   return (
//     tomorrow.getDate() === dateToCheck.getDate() &&
//     tomorrow.getMonth() === dateToCheck.getMonth() &&
//     tomorrow.getFullYear() === dateToCheck.getFullYear()
//   );
// }

export const getUserFromRequest = (req: Request): UserDTO => {
  const user = req.user as UserDTO;
  if (!user) {
    throw ApiError.Unauthorized();
  }
  return user;
};

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
    [9, 10, 11].includes(trainingDateTime.getHours());

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

export function isCancellationForbidden(
  trainingDate: any,
  currentTime: any = new Date(),
): boolean {
  const kyivCurrentTime = toZonedTime(currentTime, timeZone);
  const trainingTime = toZonedTime(trainingDate, timeZone);

  // Get hours in Kyiv time
  const currentHour = Number(formatInTimeZone(kyivCurrentTime, timeZone, 'HH'));
  const trainingHour = Number(formatInTimeZone(trainingTime, timeZone, 'HH'));

  const hoursDiff = calculateHoursDiff(trainingTime, kyivCurrentTime);
  const isEarlyMorningTraining = [9, 10, 11].includes(trainingHour);
  const isLateReservationUpdate = currentHour >= 21 && isTomorrow(trainingTime);
  const isEarlyReservationUpdate = currentHour < 8 && isToday(trainingTime);

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
