import { ErrorRequestHandler } from 'express';
import {
    handleCastError,
    handleDuplicateKeyError,
    sendDevError,
    sendProdError,
} from '../utils/errorHandlerHelpers';
import config from 'config';
import { HttpStatusCodes } from '../constants/httpStatusCodes';

const enviroment = config.get<'production' | 'development'>('enviroment');

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';

    if (enviroment === 'development') {
        sendDevError(err, req, res);
    }

    if (enviroment === 'production') {
        let error = Object.create(err);

        if (error.code === 11000) {
            error = handleDuplicateKeyError(error);
        }

        if (error.name === 'CastError') {
            error = handleCastError(error);
        }

        sendProdError(error, req, res);
    }
};

export default globalErrorHandler;
