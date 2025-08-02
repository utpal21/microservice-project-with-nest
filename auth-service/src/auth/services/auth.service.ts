import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../repositories/user.repository';
import { AuthRepository } from '../repositories/auth.repository';
import { PublisherService } from '../../rabbitmq/publisher.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { USER_CREATED_EVENT } from '../auth.constants';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly userRepo: UserRepository,
        private readonly authRepo: AuthRepository,
        private readonly jwt: JwtService,
        private readonly publisher: PublisherService,
        private readonly config: ConfigService,
    ) {}

    async register(data: RegisterDto) {
        const hashed = await bcrypt.hash(data.password, 10);
        const user = await this.userRepo.create({ ...data, password: hashed });

        await this.publisher.publishUserCreated(USER_CREATED_EVENT, user);
        this.logger.log(`User registered: ${user.email}`);

        return { message: 'User registered successfully' };
    }

    async login(data: LoginDto) {
        const user = await this.userRepo.findByEmail(data.email);
        if (!user || !(await bcrypt.compare(data.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: TokenPayload = { id: user._id.toHexString(), email: user.email, role: user.role };
        const accessToken = this.jwt.sign(payload);
        const refreshToken = this.jwt.sign(payload, { expiresIn: '7d' });

        await this.authRepo.saveRefreshToken(user._id.toString(), refreshToken);

        return { accessToken, refreshToken };
    }

    async refreshToken(token: string) {
        const savedToken = await this.authRepo.findRefreshToken(token);
        if (!savedToken) throw new UnauthorizedException('Invalid refresh token');

        const payload = this.jwt.verify(token) as TokenPayload;
        const newAccessToken = this.jwt.sign(payload);

        return { accessToken: newAccessToken };
    }

    async logout(refreshToken: string) {
        await this.authRepo.deleteRefreshToken(refreshToken);
        return { message: 'Logged out successfully' };
    }

    async validateToken(token: string) {
        const cleanToken = token.replace(/^Bearer\s+/, '');
        console.log('🔑 Validating token:', cleanToken);
        console.log('🔐 Using secret:', process.env.JWT_SECRET);
        try {
            const decoded = this.jwt.verify(cleanToken, { secret: process.env.JWT_SECRET });
            console.log('✅ Token decoded:', decoded);
            return decoded;
        } catch {
            throw new UnauthorizedException('Invalid token');
        }
    }
}