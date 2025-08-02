import { Types } from 'mongoose';

export class ProductResponseDto {
    readonly _id!: Types.ObjectId;
    readonly name!: string;
    readonly description!: string;
    readonly price!: number;
    readonly images!: string[];
    readonly category!: string;
    readonly userId!: Types.ObjectId;
    readonly isActive!: boolean;
    readonly createdAt!: Date;
    readonly updatedAt!: Date;
}
