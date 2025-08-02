import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '../models/user.model';

@Injectable()
export class UserRepository {
    private readonly logger = new Logger(UserRepository.name);

    constructor(@InjectModel(User) private readonly userModel: ReturnModelType<typeof User>) {}

    async create(data: Partial<User>) {
        this.logger.log(`Creating user: ${data.email}`);
        return this.userModel.create(data);
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ email });
    }
}