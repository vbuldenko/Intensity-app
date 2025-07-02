import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto, GoogleAuthDto } from './dto/auth.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { UserRole } from '../../common/enums';

type JwtPayload = {
  email: string;
  sub: string;
  role: string;
  firstName: string;
  lastName: string;
};

type UserResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImage?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private validateUserPassword = async (
    password: string,
    hashedPassword: string,
  ): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
  };

  private createUserResponse = (user: UserDocument): UserResponse => ({
    id: String(user._id),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    profileImage: user.profileImage,
  });

  private createJwtPayload = (user: UserDocument): JwtPayload => ({
    email: user.email,
    sub: String(user._id),
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  });

  validateUser = async (
    email: string,
    password: string,
  ): Promise<UserDocument | null> => {
    const user = await this.usersService.findByEmail(email);
    if (
      user &&
      user.password &&
      (await this.validateUserPassword(password, user.password))
    ) {
      return user;
    }
    return null;
  };

  login = async (loginDto: LoginDto) => {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.updateLastLogin(String(user._id));

    const payload = this.createJwtPayload(user);

    return {
      access_token: this.jwtService.sign(payload),
      user: this.createUserResponse(user),
    };
  };

  register = async (registerDto: RegisterDto) => {
    const user = await this.usersService.create({
      ...registerDto,
      role: UserRole.CLIENT, // Default role for registration
      emailVerified: false,
    });

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  };

  googleAuth = async (googleAuthDto: GoogleAuthDto) => {
    let user = await this.usersService.findByGoogleId(googleAuthDto.googleId);

    if (!user) {
      const existingUser = await this.usersService.findByEmail(
        googleAuthDto.email,
      );
      if (existingUser) {
        const userId = String(existingUser._id);
        user = await this.usersService.update(userId, {
          googleId: googleAuthDto.googleId,
          emailVerified: true,
        });
      } else {
        user = await this.usersService.create({
          ...googleAuthDto,
          password: 'google-auth-placeholder', // Required field for Google users
          role: UserRole.CLIENT,
          emailVerified: true,
        });
      }
    }

    const userId = user.id;
    await this.usersService.updateLastLogin(userId);

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  };

  verifyToken = async (token: string) => {
    try {
      const payload: unknown = this.jwtService.verify(token);
      if (
        typeof payload === 'object' &&
        payload !== null &&
        'sub' in payload &&
        typeof (payload as Record<string, unknown>).sub === 'string'
      ) {
        const user = await this.usersService.findOne(
          (payload as Record<string, unknown>).sub as string,
        );
        return user;
      }
      throw new UnauthorizedException('Invalid token format');
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  };
}
