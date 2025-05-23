import dotenv from 'dotenv';
import { ApiError } from '../exceptions/api.error.js';
import * as userService from '../services/user.service.js';
import * as tokenService from '../services/token.service.js';
import * as emailService from '../services/email.service.js';
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
  comparePasswords,
  validateIdentifier,
} from '../utils/index.js';
// import { admin } from '../configs/Firebase';
dotenv.config();
const sendAuthentication = async (res, user) => {
  const { accessToken, refreshToken, userData } =
    await tokenService.generateTokensData(user);
  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.send({
    user: userData,
    accessToken,
  });
};
export const register = async (req, res) => {
  const { firstName, lastName, email, phone, password, role } = req.body;
  const errors = {
    firstName: validateName(firstName),
    lastName: validateName(lastName),
    email: validateEmail(email),
    phone: validatePhone(phone),
    password: validatePassword(password),
    role: validateName(role),
  };
  if (Object.values(errors).some(error => error)) {
    throw ApiError.BadRequest('Validation error', errors);
  }
  await userService.create(req.body);
  res.status(200).send({
    message: 'Further instructions were sent to your email',
  });
};
export const activate = async (req, res) => {
  const { activationToken } = req.params;
  const user = await userService.getByToken(activationToken);
  if (!user) {
    throw ApiError.NotFound({
      user: 'User does not exist or was activated already!',
    });
  }
  user.activationToken = null;
  await user.save();
  await sendAuthentication(res, user);
};
export const login = async (req, res) => {
  const { identifier, password } = req.body;
  const errors = {
    identifier: validateIdentifier(identifier),
    password: validatePassword(password),
  };
  if (Object.values(errors).some(error => error)) {
    throw ApiError.BadRequest('Validation error', errors);
  }
  const user = await userService.getUserByIdentifier(identifier);
  if (!user) {
    throw ApiError.NotFound({ user: 'Invalid user data' });
  }
  if (user.activationToken) {
    throw ApiError.BadRequest('Activation error', {
      user: 'User not activated. Please check your email',
    });
  }
  const isPasswordValid = await comparePasswords(password, user.password);
  if (!isPasswordValid) {
    throw ApiError.BadRequest('Invalid credentials');
  }
  await sendAuthentication(res, user);
};
export const refresh = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || '';
  if (!refreshToken) {
    res.clearCookie('refreshToken');
    throw ApiError.Unauthorized('no token provided');
  }
  const userData = await tokenService.validateRefreshToken(refreshToken);
  const token = await tokenService.getByToken(refreshToken);
  if (!userData || !token) {
    res.clearCookie('refreshToken');
    throw ApiError.Unauthorized('invalid token');
  }
  const user = await userService.getById(userData.id);
  if (!user || token.userId.toString() !== user.id.toString()) {
    res.clearCookie('refreshToken');
    throw ApiError.Unauthorized('user not found');
  }
  await sendAuthentication(res, user);
};
export const logout = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || '';
  const userData = tokenService.validateRefreshToken(refreshToken);
  if (!userData || !refreshToken) {
    throw ApiError.Unauthorized();
  }
  await tokenService.removeByUserId(userData.id);
  res.clearCookie('refreshToken');
  res.sendStatus(204);
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await userService.getByEmail(email);
  if (!user) {
    throw ApiError.BadRequest('Invalid email', {
      email: 'Incorrect email or user does not exist',
    });
  }
  const userData = userService.normalize(user);
  const resetToken = tokenService.generateResetToken(userData);
  await emailService.sendResetLink(user.firstName, email, resetToken);
  res.status(200).send({
    message: 'Instructions on password reset were sent to your email',
  });
};
export const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { password, passwordConfirm } = req.body;
  if (!password || !passwordConfirm) {
    throw ApiError.BadRequest('All fields are required.');
  }
  const validationError = validatePassword(password);
  if (validationError) {
    throw ApiError.BadRequest(validationError);
  }
  if (password !== passwordConfirm) {
    throw ApiError.BadRequest('Invalid input', {
      confirmation: 'Passwords do not match',
    });
  }
  const userData = await tokenService.validateResetToken(resetToken);
  if (!userData) {
    throw ApiError.BadRequest('Invalid token', {
      resetToken: 'Invalid or expired reset token',
    });
  }
  const user = await userService.getByEmail(userData.email);
  if (!user) {
    throw ApiError.NotFound();
  }
  if (userData.id !== user.id) {
    throw ApiError.Unauthorized();
  }
  await userService.update({ password }, user.id);
  res.status(200).send({ message: 'Password reset successfully' });
};
export const googleAuthCallback = (req, res) => {
  const { refreshToken } = req.user; // To sedate ts console) Potentially should use other type
  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.redirect(`${process.env.CLIENT_URL}/profile`);
};
// export const googleAuthFireBase = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   const { idToken } = req.body;
//   const decodedToken = await admin.auth().verifyIdToken(idToken);
//   const user = await userService.getOrCreateGoogleUser(decodedToken);
//   await sendAuthentication(res, user);
// };
