import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from '@m8a/nestjs-typegoose'; 
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PublisherService } from './rabbitmq/publisher.service';
import { AppController } from './app.controller';

console.log('AppModule sees User:', UsersModule);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypegooseModule.forRoot(process.env.MONGO_URI as string),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [PublisherService],
})
export class AppModule {}
