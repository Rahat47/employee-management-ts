import {
    getModelForClass,
    modelOptions,
    prop,
    Severity,
    pre,
    DocumentType,
    index,
    Ref,
} from '@typegoose/typegoose';
import { nanoid } from 'nanoid';
import argon2 from 'argon2';
import logger from '../utils/logger';
import { Company } from './company.model';

export const privateFields = [
    'password',
    'passwordResetCode',
    'verificationCode',
    '__v',
    'verified',
];

export enum userRoles {
    generalAuthority = 'generalAuthority',
    systemAdmin = 'systemAdmin',
    administrativeAuthority = 'administrativeAuthority',
}

@pre<User>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const hash = await argon2.hash(this.password);
    this.password = hash;

    return next();
})
@index<User>({
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

    @prop({
        enum: [
            userRoles.generalAuthority,
            userRoles.systemAdmin,
            userRoles.administrativeAuthority,
        ],
        default: () => userRoles.generalAuthority,
    })
    role: string;

    @prop({ default: null, required: true, ref: () => Company })
    company: Ref<Company> | null;

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
