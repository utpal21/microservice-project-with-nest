import { prop } from '@typegoose/typegoose';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class User {
  @IsString()
  @prop({ required: true })
  name!: string;

  @IsEmail()
  @prop({ required: true, unique: true })
  email!: string;

  @IsString()
  @IsOptional()
  @prop()
  role?: string;

  @IsString()
  @prop({ required: true })
  password!: string;  // hashed password
}
