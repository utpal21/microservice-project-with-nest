import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { RefreshToken } from '../models/refresh-token.model';

@Injectable()
export class AuthRepository {
    private readonly logger = new Logger(AuthRepository.name);

    constructor(
    @InjectModel(RefreshToken)
    private readonly refreshTokenModel: ReturnModelType<typeof RefreshToken>,
    ) {}

    async saveRefreshToken(userId: string, token: string) {
        this.logger.log(`Saving refresh token for user: ${userId}`);
        return this.refreshTokenModel.create({ user: userId, token });
    }

    async findRefreshToken(token: string) {
        return this.refreshTokenModel.findOne({ token });
    }

    async deleteRefreshToken(token: string) {
        return this.refreshTokenModel.deleteOne({ token });
    }
}