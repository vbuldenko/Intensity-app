import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

type GoogleProfile = {
  id: string;
  name: {
    givenName: string;
    familyName: string;
  };
  emails: Array<{ value: string }>;
  photos: Array<{ value: string }>;
};

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('google.clientId') || '',
      clientSecret: configService.get<string>('google.clientSecret') || '',
      callbackURL: '/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const googleAuthDto = {
      googleId: id,
      email: emails[0]?.value || '',
      firstName: name?.givenName || '',
      lastName: name?.familyName || '',
      profileImage: photos[0]?.value,
    };

    try {
      const result = await this.authService.googleAuth(googleAuthDto);
      done(null, result);
    } catch (error) {
      done(error, false);
    }
  }
}
