import db from '../db/models';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../exceptions/api.error';

import * as userService from './user.service';
import 'dotenv/config';
import { UserDTO } from '../types/UserDTO';
import { User } from '../types/User';

export function generateAccessToken(user: UserDTO): string {
  return jwt.sign(user, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: '1h',
  });
}

export function generateRefreshToken(user: UserDTO): string {
  return jwt.sign(user, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: '30d',
  });
}

export function generateResetToken(user: UserDTO): string {
  return jwt.sign(user, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: '1h',
  });
}

export function validateAccessToken(token: string): JwtPayload | string | null {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
  } catch (error) {
    return null;
  }
}

export function validateRefreshToken(token: string): UserDTO | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);

    return decoded as UserDTO;
  } catch (error) {
    return null;
  }
}

export function validateResetToken(token: string): UserDTO | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);

    return decoded as UserDTO;
  } catch (error) {
    return null;
  }
}

export const save = async (
  userId: number,
  refreshToken: string,
): Promise<void> => {
  const user = await userService.getById(userId);

  if (!user) {
    throw ApiError.NotFound();
  }

  let token = await db.Token.findOne({ where: { userId } });

  if (!db.token) {
    await db.Token.create({ userId, refreshToken });
    return;
  }

  token.refreshToken = refreshToken;
  await token.save();
};

export const getByToken = (refreshToken: string) => {
  return db.Token.findOne({ where: { refreshToken } });
};

export const removeByUserId = (userId: number) => {
  return db.Token.destroy({ where: { userId } });
};

export async function generateTokensData(user: User) {
  const userData = userService.normalize(user);
  const accessToken = generateAccessToken(userData);
  const refreshToken = generateRefreshToken(userData);

  await save(userData.id, refreshToken);

  return { accessToken, refreshToken, userData };
}
