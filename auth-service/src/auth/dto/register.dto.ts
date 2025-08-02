import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsIn } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email!: string;

    @MinLength(6)
    password!: string;

    @IsNotEmpty()
    name!: string;

    @IsOptional()
    @IsIn(["user", "admin"])
    role?: string;
}