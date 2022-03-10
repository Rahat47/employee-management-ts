import { omit } from 'lodash';
import { DocumentType } from '@typegoose/typegoose';
import { User } from '../models/user.model';

export const omitUserData = (user: DocumentType<User>) => {
    return omit(user.toJSON(), [
        'password',
        'verificationCode',
        '__v',
        'passwordResetCode',
    ]);
};
