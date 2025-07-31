import { Injectable } from '@nestjs/common';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from './user.model';

@Injectable()
export class UsersService {

constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>
  ) {}

  async create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}
