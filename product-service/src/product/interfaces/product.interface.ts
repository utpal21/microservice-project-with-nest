import { Types } from 'mongoose';

export interface IProduct {
    _id?: Types.ObjectId;
    name: string;
    description: string;
    price: number;
    images?: string[];
    category: string;
    userId: Types.ObjectId;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
