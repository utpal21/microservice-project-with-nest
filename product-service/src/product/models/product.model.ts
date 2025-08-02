// src/product/models/product.model.ts
import { prop, modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({ schemaOptions: { timestamps: true } })
export class Product {
    readonly _id!: Types.ObjectId;

    @prop({ required: true })
    name!: string;

    @prop({ required: true })
    description!: string;

    @prop({ required: true, min: 0 })
    price!: number;

    @prop({ type: () => [String], default: [] })
    images!: string[];

    @prop({ required: true })
    category!: string;

    @prop({ required: true, type: () => Types.ObjectId })
    userId!: Types.ObjectId; // Owner from Auth Service

    @prop({ default: true })
    isActive!: boolean;
}
