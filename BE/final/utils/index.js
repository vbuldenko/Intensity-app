import bcrypt from 'bcrypt';
import { ApiError } from '../exceptions/api.error.js';
import { timeZone } from './trainingInitiator.js';

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
export const getUserFromRequest = req => {
  const user = req.user;
  if (!user) {
    throw ApiError.Unauthorized();
  }
  return user;
};
export function isTomorrow(dateToCheck) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    tomorrow.getDate() === dateToCheck.getDate() &&
    tomorrow.getMonth() === dateToCheck.getMonth() &&
    tomorrow.getFullYear() === dateToCheck.getFullYear()
  );
}
export function isToday(dateToCheck) {
  const today = new Date();
  return (
    today.getDate() === dateToCheck.getDate() &&
    today.getMonth() === dateToCheck.getMonth() &&
    today.getFullYear() === dateToCheck.getFullYear()
  );
}
export const timeZone = 'Europe/Kiev';
