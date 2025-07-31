import { Module } from '@nestjs/common';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { UsersService } from './users.service';
import { User } from './user.model';

@Module({
  imports: [TypegooseModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
