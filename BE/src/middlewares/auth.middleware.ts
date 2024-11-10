import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exceptions/api.error';
import { validateAccessToken } from '../services/token.service';
import { UserDTO } from '../db/models/User';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader: string = req.headers['authorization'] || '';
  const [, accessToken] = authHeader.split(' ');

  if (!authHeader || !accessToken) {
    throw ApiError.Unauthorized('Access token is missing');
  }

  const userData = validateAccessToken(accessToken) as UserDTO | null;

  if (!userData) {
    throw ApiError.Unauthorized('Invalid access token');
  }

  // Add user data to the request object if needed
  req.user = userData;

  next();
}
