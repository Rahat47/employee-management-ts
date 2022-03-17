import { Request } from 'express';
import asyncHandler from 'express-async-handler';
import { HttpStatusCodes } from '../constants/httpStatusCodes';
import { CreateSessionInput } from '../schemas/auth.schema';
import { signAccessToken, signRefreshToken } from '../services/auth.service';
import { findUser } from '../services/user.service';
import AppError from '../utils/AppError';

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

        // sign a access token
        const accessToken = signAccessToken(user);

        // sign e refresh token
        const refreshToken = await signRefreshToken(user._id);

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
