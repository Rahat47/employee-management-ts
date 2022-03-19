import { NextFunction, Request, Response } from 'express';
import { HttpStatusCodes } from '../constants/httpStatusCodes';
import { userRoles } from '../models/user.model';
import AppError from '../utils/AppError';

export const restrictRole = (...roles: userRoles[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { role } = res.locals.user;
        if (!roles.includes(role)) {
            return next(
                new AppError(
                    'You are not authorized to perform this action',
                    HttpStatusCodes.FORBIDDEN
                )
            );
        }

        next();
    };
};
