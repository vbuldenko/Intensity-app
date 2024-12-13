import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { GOOGLE_AUTH_OPTIONS } from '../configs/GoogleAuth.js';
import * as userService from './user.service.js';
import * as tokenService from './token.service.js';
passport.use(new GoogleStrategy(GOOGLE_AUTH_OPTIONS, processingCallback));
async function processingCallback(
  req,
  accessToken,
  refreshToken,
  profile,
  done,
) {
  try {
    const { name, email } = profile._json;
    const user = await userService.getOrCreateGoogleUser({ name, email });
    const tokens = await tokenService.generateTokensData(user);
    return done(null, {
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    return done(error);
  }
}
export { passport };
