import { Path } from './RoutePath.js';
import dotenv from 'dotenv';
dotenv.config();
const GOOGLE_AUTH_OPTIONS = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: Path.googleLoginCB,
  passReqToCallback: true,
};
export { GOOGLE_AUTH_OPTIONS };
