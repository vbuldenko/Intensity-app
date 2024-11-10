import { ApiError } from '../exceptions/api.error';
import { validateAccessToken } from '../services/token.service';
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
    // Add user data to the request object if needed
    req.user = userData;
    next();
}
