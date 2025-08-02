import { IsString, IsNumber, IsArray, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    name!: string;

    @IsString()
    description!: string;

    @IsNumber()
    @Min(0)
    price!: number;

    @IsOptional()
    @IsArray()
    images?: string[];

    @IsString()
    category!: string;
}
