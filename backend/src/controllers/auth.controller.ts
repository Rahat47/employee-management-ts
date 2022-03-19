import { Request } from 'express';
import asyncHandler from 'express-async-handler';
import { get } from 'lodash';
import { HttpStatusCodes } from '../constants/httpStatusCodes';
import { CreateSessionInput } from '../schemas/auth.schema';
import {
    createSession,
    findSessionById,
    signAccessToken,
    signRefreshToken,
    updateSession,
} from '../services/auth.service';
import { findUser, findUserById } from '../services/user.service';
import AppError from '../utils/AppError';
import { verifyJWT } from '../utils/jwt';
import logger from '../utils/logger';

export const createSessionHandler = asyncHandler(
    async (req: Request<{}, {}, CreateSessionInput>, res, next) => {
        const { email, password } = req.body;

        const user = await findUser({ email });

        if (!user) {
            return next(
                new AppError(
                    'Invalid Email or Password',
                    HttpStatusCodes.UNAUTHORIZED
                )
            );
        }

        if (!user.verified) {
            return next(
                new AppError(
                    'User not verified, Please verify your email first',
                    HttpStatusCodes.UNAUTHORIZED
                )
            );
        }

        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return next(
                new AppError(
                    'Invalid Email or Password',
                    HttpStatusCodes.UNAUTHORIZED
                )
            );
        }

        const session = await createSession(user._id);

        // sign a access token
        const accessToken = signAccessToken(user, session._id);

        // sign e refresh token
        const refreshToken = await signRefreshToken(session._id);

        // send these tokens

        res.status(HttpStatusCodes.OK).json({
            status: 'success',
            data: {
                accessToken,
                refreshToken,
            },
            message: 'User logged in successfully',
        });
    }
);

export const refreshAccessTokenHandler = asyncHandler(
    async (req, res, next) => {
        const refreshToken = get(req, 'headers.x-refresh-token', '');

        const { decoded } = verifyJWT<{ session: string }>(
            refreshToken,
            'refreshTokenPublicKey'
        );

        if (!decoded || !get(decoded, 'session')) {
            return next(
                new AppError(
                    'Could not refresh access token.',
                    HttpStatusCodes.UNAUTHORIZED
                )
            );
        }

        const session = await findSessionById(decoded.session);

        if (!session || !session.valid) {
            return next(
                new AppError(
                    'Could not refresh access token.',
                    HttpStatusCodes.UNAUTHORIZED
                )
            );
        }

        const user = await findUserById(String(session.user));

        if (!user) {
            return next(
                new AppError(
                    'Could not refresh access token.',
                    HttpStatusCodes.UNAUTHORIZED
                )
            );
        }

        const accessToken = signAccessToken(user, session._id);

        res.status(HttpStatusCodes.OK).json({
            status: 'success',
            data: {
                accessToken,
            },
            message: 'Access token refreshed successfully',
        });
    }
);

export const logoutHandler = asyncHandler(async (req, res, next) => {
    const sessionId = get(res, 'locals.user.sessionId', '');

    if (!sessionId) {
        return next(
            new AppError(
                'Could not logout. Please try again later.',
                HttpStatusCodes.UNAUTHORIZED
            )
        );
    }

    await updateSession({ _id: sessionId }, { valid: false });

    res.status(HttpStatusCodes.OK).json({
        status: 'success',
        data: {
            accessToken: null,
            refreshToken: null,
        },
        message: 'User logged out successfully',
    });
});
