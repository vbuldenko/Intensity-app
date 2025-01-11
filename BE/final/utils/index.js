import bcrypt from 'bcrypt';
import { ApiError } from '../exceptions/api.error.js';
import { timeZone } from './trainingInitiator.js';
import { toZonedTime } from 'date-fns-tz';
import { isToday } from 'date-fns';
export function validateIdentifier(identifier) {
  if (identifier.includes('@')) {
    return validateEmail(identifier);
  } else if (/^\d+$/.test(identifier)) {
    return validatePhone(identifier);
  } else {
    return 'Input data should be email or phone number';
  }
}
export function validateEmail(email) {
  const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;
  if (!email) {
    return 'Email is required';
  }
  if (!emailPattern.test(email)) {
    return 'Email is not valid';
  }
}
export function validatePhone(phone) {
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
export function validatePassword(password) {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 4) {
    return 'Should be at least 6 characters';
  }
}
export function validateName(value) {
  if (!value) {
    return 'Shold not be empty';
  }
  if (!value || value.length < 3) {
    return 'Should be at least 3 characters';
  }
}
export function hashPassword(password, saltRounds = 10) {
  return bcrypt.hash(password, saltRounds);
}
export const comparePasswords = (plainPWD, userPWDHash) => {
  return bcrypt.compare(plainPWD, userPWDHash);
};
export function calculateHoursDiff(
  trainingTime,
  currentTime = toZonedTime(new Date(), timeZone),
) {
  const diffInMilliseconds = trainingTime.getTime() - currentTime.getTime();
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
  return diffInHours;
}
export function isTomorrow(dateToCheck) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    tomorrow.getDate() === dateToCheck.getDate() &&
    tomorrow.getMonth() === dateToCheck.getMonth() &&
    tomorrow.getFullYear() === dateToCheck.getFullYear()
  );
}

export const getUserFromRequest = req => {
  const user = req.user;
  if (!user) {
    throw ApiError.Unauthorized();
  }
  return user;
};
export const checkAdminRole = user => {
  if (user.role !== 'admin') {
    throw ApiError.Unauthorized();
  }
};
export const isAdmin = user => {
  if (user.role !== 'admin') {
    throw ApiError.Unauthorized();
  }
};

export const canTrainingProceed = (trainingDate, visitorsCount) => {
  const kyivCurrentTime = toZonedTime(new Date(), timeZone);
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

export function isCancellationForbidden(trainingDate) {
  const kyivCurrentTime = toZonedTime(new Date(), timeZone);
  const trainingTime = toZonedTime(trainingDate, timeZone);
  const hoursDiff = calculateHoursDiff(trainingTime, kyivCurrentTime);
  const currentHour = kyivCurrentTime.getHours();
  const isEarlyMorningTraining = [9, 10, 11].includes(trainingTime.getHours());
  const isLateReservationUpdate = currentHour >= 21 && isTomorrow(trainingTime);
  const isEarlyReservationUpdate = currentHour < 8 && isToday(trainingTime);

  return (
    hoursDiff < 3 ||
    (isLateReservationUpdate && isEarlyMorningTraining) ||
    (isEarlyReservationUpdate && isEarlyMorningTraining)
  );
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
