import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PublisherService } from '../rabbitmq/publisher.service';
import { RegisterDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
    private readonly publisher: PublisherService
  ) {}

  async register(data: RegisterDto) {
    const { email, password, name } = data;
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ email, password: hashed, name });
    await this.publisher.publishUserCreated(user);
    return { message: 'User registered successfully' };
  }

  async login(data: LoginDto) {
    const { email, password } = data;
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user._id, email: user.email };
    const accessToken = this.jwt.sign(payload, { expiresIn: process.env.JWT_EXPIRY });
    const refreshToken = this.jwt.sign(payload, { expiresIn: process.env.JWT_REFRESH_EXPIRY });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, { secret: process.env.JWT_SECRET });
      const newAccessToken = this.jwt.sign(
        { id: payload.id, email: payload.email },
        { expiresIn: process.env.JWT_EXPIRY }
      );
      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateToken(token: string) {
    try {
      return this.jwt.verify(token, { secret: process.env.JWT_SECRET });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
