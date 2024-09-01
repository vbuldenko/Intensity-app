import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exceptions/api.error';
import { UserDTO } from '../types/UserDTO';
import { validateAccessToken } from '../services/token.service';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader: string = req.headers['authorization'] || '';
  const [, accessToken] = authHeader.split(' ');

  if (!authHeader || !accessToken) {
    throw ApiError.Unauthorized();
  }

  const userData = validateAccessToken(accessToken) as UserDTO | null;

  if (!userData) {
    throw ApiError.Unauthorized();
  }

  // Add user data to the request object if needed
  req.user = userData;

  next();
}
