import { Response, Request } from 'express';
import { HttpStatusCodes } from '../constants/httpStatusCodes';
import AppError from './AppError';

export const handleDuplicateKeyError = (err: any) => {
    const key = Object.keys(err.keyValue)[0];
    const value = err.keyValue[key];
    return new AppError(
        `An account with email "${value}" already exists`,
        HttpStatusCodes.CONFLICT
    );
};

export const handleCastError = (err: any) => {
    const message = `Invalid ${err.path}: ${err.value}. Please enter a valid ${err.path}`;
    return new AppError(message, HttpStatusCodes.BAD_REQUEST);
};

export const sendDevError = (err: any, req: Request, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
};

export const sendProdError = (err: any, req: Request, res: Response) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Something went wrong',
        });
    }
};
