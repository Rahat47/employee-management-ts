import UserModel, { User } from '../models/user.model';

export const createUser = async (input: Partial<User>) => {
    const user = await UserModel.create(input);
    return user;
};

export const findUserById = async (id: string) => {
    const user = await UserModel.findById(id);
    return user;
};

export const findUser = async (input: Partial<User>) => {
    const user = await UserModel.findOne(input);
    return user;
};
