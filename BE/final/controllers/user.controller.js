import { ApiError } from '../exceptions/api.error.js';
import * as userService from '../services/user.service.js';
import * as tokenService from '../services/token.service.js';
import * as emailService from '../services/email.service.js';
import {
  validateName,
  validateEmail,
  validatePassword,
  comparePasswords,
  getUserFromRequest,
} from '../utils/index.js';
export const getAllActive = async (req, res) => {
  const users = await userService.getAllActive();
  res.send(users);
};
export const getOneById = async (req, res) => {
  const user = await userService.getById(req.params.id);
  res.send(user);
};
export const getProfile = async (req, res) => {
  const user = getUserFromRequest(req);
  const profileData = await userService.getById(user.id);
  if (!profileData) {
    throw ApiError.NotFound();
  }
  res.send(profileData);
};
export const updateUser = async (req, res) => {
  const { refreshToken } = req.cookies;
  const {
    updateType,
    firstName,
    email,
    emailConfirm,
    password,
    newPassword,
    newPasswordConfirm,
    fontSize,
  } = req.body;
  const userData = tokenService.validateRefreshToken(refreshToken);
  const tokenFromDB = await tokenService.getByToken(refreshToken);
  if (
    !userData ||
    !tokenFromDB ||
    userData.id !== tokenFromDB.userId.toString()
  ) {
    throw ApiError.Unauthorized();
  }
  const user = await userService.getById(userData.id);
  if (!user) {
    throw ApiError.NotFound();
  }
  switch (updateType) {
    case 'name':
      const nameValidationError = validateName(firstName);
      if (nameValidationError) {
        throw ApiError.BadRequest('Validation error', {
          firstName: nameValidationError,
        });
      }
      const updatedNameUser = await userService.update(
        { firstName },
        userData.id,
      );
      res.status(200).send(userService.normalize(updatedNameUser));
      break;
    case 'email':
      const emailErrors = {
        email: validateEmail(email),
        confirm: validateEmail(emailConfirm),
        password: validatePassword(password),
      };
      if (Object.values(emailErrors).some(error => error)) {
        throw ApiError.BadRequest('Validation error', emailErrors);
      }
      if (email !== emailConfirm) {
        throw ApiError.BadRequest('Invalid input', {
          confirmation: 'Emails do not match',
        });
      }
      const isEmailPasswordValid = await comparePasswords(
        password,
        user.password,
      );
      if (!isEmailPasswordValid) {
        throw ApiError.BadRequest('Password not correct');
      }
      const oldEmail = user.email;
      const updatedEmailUser = await userService.update({ email }, user.id);
      await emailService.notifyOldEmail(user.firstName, email, oldEmail);
      res.status(200).send(userService.normalize(updatedEmailUser));
      break;
    case 'password':
      const passwordValidationError = validatePassword(newPassword);
      if (passwordValidationError) {
        throw ApiError.BadRequest(passwordValidationError);
      }
      if (newPassword !== newPasswordConfirm) {
        throw ApiError.BadRequest('Invalid input', {
          confirmation: 'Passwords do not match',
        });
      }
      const isOldPasswordValid = await comparePasswords(
        password,
        user.password,
      );
      if (!isOldPasswordValid) {
        throw ApiError.BadRequest('Original password not correct');
      }
      await userService.update({ password: newPassword }, user.id);
      res.sendStatus(200);
      break;
    case 'fontSize':
      if (typeof fontSize !== 'number' || fontSize < 10) {
        throw ApiError.BadRequest('Invalid font size');
      }
      const updatedSettingsUser = await userService.update(
        { settings: { ...user.settings, fontSize } },
        user.id,
      );
      res.status(200).send(updatedSettingsUser);
      break;
    default:
      throw ApiError.BadRequest('Invalid update type');
  }
};
export const remove = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || '';
  const userData = tokenService.validateRefreshToken(refreshToken);
  const token = await tokenService.getByToken(refreshToken);
  if (!userData || !token || userData.id !== token.userId.toString()) {
    throw ApiError.Unauthorized();
  }
  await userService.remove(userData.id);
  res.status(204).end();
};
