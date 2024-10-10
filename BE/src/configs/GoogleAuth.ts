import { Path } from './RoutePath';
import dotenv from 'dotenv';
import { StrategyOptionsWithRequest } from 'passport-google-oauth20';

dotenv.config();

interface GoogleAuthOptions extends StrategyOptionsWithRequest {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
}

const GOOGLE_AUTH_OPTIONS: GoogleAuthOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: Path.googleLoginCB,
  passReqToCallback: true,
};

export { GOOGLE_AUTH_OPTIONS };
