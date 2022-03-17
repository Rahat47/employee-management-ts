import {
    getModelForClass,
    modelOptions,
    prop,
    Severity,
    pre,
    DocumentType,
    index,
} from '@typegoose/typegoose';
import { nanoid } from 'nanoid';
import argon2 from 'argon2';
import logger from '../utils/logger';

export const privateFields = [
    'password',
    'passwordResetCode',
    'verificationCode',
    '__v',
    'verified',
];

@pre<User>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const hash = await argon2.hash(this.password);
    this.password = hash;

    return next();
})
@index({
    email: 1,
    verified: 1,
})
@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
    options: {
        allowMixed: Severity.ALLOW,
    },
})
export class User {
    @prop({ lowercase: true, required: true, unique: true })
    email: string;

    @prop({ required: true })
    firstName: string;

    @prop({ required: true })
    lastName: string;

    @prop({ required: true })
    password: string;

    @prop({ required: true, default: false })
    verified: boolean;

    @prop({ required: true, default: () => nanoid() })
    verificationCode: string;

    @prop()
    passwordResetCode: string | null;

    async validatePassword(this: DocumentType<User>, password: string) {
        try {
            return await argon2.verify(this.password, password);
        } catch (error) {
            logger.error(error, 'User.validatePassword');
            return false;
        }
    }
}

const UserModel = getModelForClass(User);

export default UserModel;
