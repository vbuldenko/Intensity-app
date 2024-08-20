import passport from 'passport';
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from 'passport-google-oauth20';
import { GOOGLE_AUTH_OPTIONS } from '../configs/GoogleAuth';
import * as userService from './user.service';
import * as tokenService from './token.service';
import { Request } from 'express';

passport.use(new GoogleStrategy(GOOGLE_AUTH_OPTIONS, processingCallback));

async function processingCallback(
  req: Request,
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback,
): Promise<void> {
  try {
    const { name, email } = profile._json;
    const user = await userService.findOrCreateGoogleUser({ name, email });
    const tokens = await tokenService.generateTokensData(user);

    return done(null, {
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    return done(error);
  }
}

export { passport };
