import { Request, Response } from 'express';
import { ApiError } from '../exceptions/api.error';
import * as userService from '../services/user.service';
import * as tokenService from '../services/token.service';
import * as emailService from '../services/email.service';
import {
  validateName,
  validateEmail,
  validatePassword,
  comparePasswords,
} from '../utils';
import { UserDTO } from '../types/UserDTO';

export const getAllActive = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const users = await userService.getAllActive();
  res.send(users.map(userService.normalize));
};

export const getProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken || '';
  const userData = tokenService.validateRefreshToken(
    refreshToken,
  ) as UserDTO | null;

  const token = await tokenService.getByToken(refreshToken);

  if (!userData || !token) {
    throw ApiError.Unauthorized();
  }

  const user = await userService.getByEmail(userData.email);

  if (!user || token.userId !== user.id) {
    throw ApiError.Unauthorized();
  }

  res.send(userService.normalize(user));
};

export const updateName = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name } = req.body;
  const refreshToken = req.cookies?.refreshToken || '';
  const userData = tokenService.validateRefreshToken(
    refreshToken,
  ) as UserDTO | null;
  const token = await tokenService.getByToken(refreshToken);

  const validationError = validateName(name);

  if (validationError) {
    throw ApiError.BadRequest('Validation error', { name: validationError });
  }

  if (!userData || !token || userData.id !== token.userId) {
    throw ApiError.Unauthorized();
  }

  const newUser = await userService.update({ name }, userData.id);

  res.status(200).send(userService.normalize(newUser));
};

export const updateEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { refreshToken } = req.cookies;
  const { password, email, emailConfirm } = req.body;

  const errors = {
    email: validateEmail(email),
    confirm: validateEmail(emailConfirm),
    password: validatePassword(password),
  };

  if (Object.values(errors).some(error => error)) {
    throw ApiError.BadRequest('Validation error', errors);
  }

  if (email !== emailConfirm) {
    throw ApiError.BadRequest('Invalid input', {
      confirmation: `Emails do not match`,
    });
  }

  const userData = tokenService.validateRefreshToken(
    refreshToken,
  ) as UserDTO | null;

  if (!userData) {
    throw ApiError.Unauthorized();
  }

  const tokenFromDB = await tokenService.getByToken(refreshToken);

  if (!tokenFromDB) {
    throw ApiError.Unauthorized();
  }

  const user = await userService.getById(userData.id);

  if (!user) {
    throw ApiError.NotFound();
  }

  const oldEmail = user.email;
  const isPasswordValid = await comparePasswords(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.BadRequest('Password not correct');
  }

  const updatedUser = await userService.update({ email }, user.id);

  await emailService.notifyOldEmail(user.name, email, oldEmail);

  res.status(200).send(userService.normalize(updatedUser));
};

export const updatePassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { oldPassword, newPassword, confirmation } = req.body;
  const { refreshToken } = req.cookies;

  const validationError = validatePassword(newPassword);

  if (validationError) {
    throw ApiError.BadRequest(validationError);
  }

  if (newPassword !== confirmation) {
    throw ApiError.BadRequest('Invalid input', {
      confirmation: `Passwords do not match`,
    });
  }

  const userData = tokenService.validateRefreshToken(
    refreshToken,
  ) as UserDTO | null;

  if (!userData) {
    throw ApiError.Unauthorized();
  }

  const tokenFromDB = await tokenService.getByToken(refreshToken);

  if (!tokenFromDB) {
    throw ApiError.Unauthorized();
  }

  const user = await userService.getById(userData.id);

  const isPasswordValid = await comparePasswords(oldPassword, user.password);

  if (!isPasswordValid) {
    throw ApiError.BadRequest('Original password not correct');
  }

  await userService.update({ password: newPassword }, tokenFromDB.userId);

  res.sendStatus(200);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken || '';
  const userData = tokenService.validateRefreshToken(
    refreshToken,
  ) as UserDTO | null;
  const token = await tokenService.getByToken(refreshToken);

  if (!userData || !token || userData.id !== token.userId) {
    throw ApiError.Unauthorized();
  }

  await userService.remove(userData.id);

  res.status(204).end();
};
