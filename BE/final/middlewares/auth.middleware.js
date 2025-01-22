import { ApiError } from '../exceptions/api.error.js';
import { validateAccessToken } from '../services/token.service.js';
import { getUserFromRequest } from '../utils/index.js';
export function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const [, accessToken] = authHeader.split(' ');
  if (!authHeader || !accessToken) {
    throw ApiError.Unauthorized('Access token is missing');
  }
  const userData = validateAccessToken(accessToken);
  if (!userData) {
    throw ApiError.Unauthorized('Invalid access token');
  }

  req.user = userData;
  next();
}

export const adminCheckerMiddleware = (req, res, next) => {
  const user = getUserFromRequest(req);
  if (user && user.role === 'admin') {
    next();
  } else {
    throw ApiError.Unauthorized('User is not an admin');
  }
};
