import bcrypt from 'bcrypt';
import { ApiError } from '../exceptions/api.error';
import { Request } from 'express';
import { UserDTO } from '../db/models/user';
import { toZonedTime } from 'date-fns-tz';
import { timeZone } from './trainingInitiator';

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
  currentTime: Date = new Date(),
): number {
  return (trainingTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
}

export function isTomorrow(dateToCheck: Date) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    tomorrow.getDate() === dateToCheck.getDate() &&
    tomorrow.getMonth() === dateToCheck.getMonth() &&
    tomorrow.getFullYear() === dateToCheck.getFullYear()
  );
}

export const canTrainingProceed = (
  trainingDate: string,
  visitorsCount: number,
): boolean => {
  const currentTime = new Date();
  // Convert the current time to the Kyiv timezone
  const kyivCurrentTime = toZonedTime(currentTime, timeZone);
  console.log('kyivCurrentTime', kyivCurrentTime);

  const trainingDateTime = new Date(trainingDate);
  const timeDifference = calculateHoursDiff(trainingDateTime, kyivCurrentTime);

  const isTrainingForTomorrowMorning =
    isTomorrow(trainingDateTime) &&
    [9, 10, 11].includes(trainingDateTime.getHours());

  if (timeDifference < 3 && visitorsCount < 2) {
    return false; // Return training to user's subscription
  }
  if (
    currentTime.getHours() >= 21 &&
    isTrainingForTomorrowMorning &&
    visitorsCount < 2
  ) {
    return false; // Return training to user's subscription
  }
  return true;
};

export const getUserFromRequest = (req: Request): UserDTO => {
  const user = req.user as UserDTO;
  if (!user) {
    throw ApiError.Unauthorized();
  }
  return user;
};

export const checkAdminRole = (user: UserDTO): void => {
  if (user.role !== 'admin') {
    throw ApiError.Unauthorized();
  }
};
