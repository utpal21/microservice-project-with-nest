import { prop, Ref, getModelForClass } from '@typegoose/typegoose';
import { User } from './user.model';

export class RefreshToken {
    @prop({ ref: () => User, required: true })
    user!: Ref<User>;

    @prop({ required: true })
    token!: string;

    @prop({ default: Date.now, expires: 60 * 60 * 24 * 7 })
    createdAt!: Date;
}

export const RefreshTokenModel = getModelForClass(RefreshToken);