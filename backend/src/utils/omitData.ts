import { omit } from 'lodash';
import { DocumentType } from '@typegoose/typegoose';
import { privateFields, User } from '../models/user.model';

export const omitUserData = (user: DocumentType<User>) => {
    return omit(user.toJSON(), privateFields);
};

export const omitData = (data: any) => {
    return omit(data, privateFields);
};
