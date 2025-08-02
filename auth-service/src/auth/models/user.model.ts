import { prop, getModelForClass } from '@typegoose/typegoose';
import { Types } from "mongoose";

export class User {
    readonly _id!: Types.ObjectId;
    
    @prop({ required: true })
    name!: string;

    @prop({ required: true, unique: true })
    email!: string;

    @prop({ required: true })
    password!: string;

    @prop({ default: 'user', enum: ['user', 'admin'] })
    role!: string;
}

export const UserModel = getModelForClass(User);