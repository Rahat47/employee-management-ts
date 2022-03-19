import { RequestHandler } from 'express';
import { HttpStatusCodes } from '../constants/httpStatusCodes';
import AppError from '../utils/AppError';

const requireUser: RequestHandler = (req, res, next) => {
    const { user } = res.locals;
    if (!user) {
        return next(
            new AppError(
                'Please login to access this route',
                HttpStatusCodes.UNAUTHORIZED
            )
        );
    }

    next();
};

export default requireUser;
