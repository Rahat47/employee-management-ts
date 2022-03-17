import { Request } from 'express';
import asyncHandler from 'express-async-handler';
import { nanoid } from 'nanoid';
import { HttpStatusCodes } from '../constants/httpStatusCodes';
import {
    CreateUserInput,
    ForgotPasswordInput,
    VerifyUserInput,
    ResetPasswordInput,
} from '../schemas/user.schema';
import { createUser, findUser, findUserById } from '../services/user.service';
import AppError from '../utils/AppError';
import logger from '../utils/logger';
import sendEmail from '../utils/mailer';
import { omitUserData } from '../utils/omitData';

export const createUserHandler = asyncHandler(
    async (req: Request<{}, {}, CreateUserInput>, res, next) => {
        const { body } = req;

        const user = await createUser(body);

        await sendEmail({
            from: 'test@example.com',
            to: user.email,
            subject: 'Welcome to the app, Please confirm your email',
            text: `Verification code:${user.verificationCode}. id: ${user._id}`,
        });

        res.status(HttpStatusCodes.OK).json({
            status: 'success',
            data: {
                user: omitUserData(user),
            },
            message: 'User created successfully',
        });
    }
);

export const verifyUserHandler = asyncHandler(
    async (req: Request<VerifyUserInput>, res, next) => {
        const { id, verificationCode } = req.params;

        // find user by id,
        const user = await findUserById(id);
        if (!user) {
            return next(
                new AppError(
                    'Could not verify user',
                    HttpStatusCodes.BAD_REQUEST
                )
            );
        }

        // check if already verified
        if (user.verified) {
            return next(
                new AppError(
                    'User already verified',
                    HttpStatusCodes.BAD_REQUEST
                )
            );
        }

        // check if verification code is correct
        if (user.verificationCode !== verificationCode) {
            return next(
                new AppError(
                    'Verification code is incorrect',
                    HttpStatusCodes.UNPROCESSABLE_ENTITY
                )
            );
        }

        // if all is correct, mark user as verified and send success message
        user.verified = true;
        await user.save();

        await sendEmail({
            from: 'example@gmail.com',
            to: user.email,
            subject: 'Your account has been verified',
            text: `Welcome to the app, ${user.firstName} ${user.lastName}`,
        });

        res.status(HttpStatusCodes.OK).json({
            status: 'success',
            data: {},
            message: 'User verified successfully',
        });

        // TODO: set verification code to null
    }
);

export const forgotPasswordHandler = asyncHandler(
    async (req: Request<{}, {}, ForgotPasswordInput>, res, next) => {
        const { email } = req.body;

        const user = await findUser({ email });

        if (!user) {
            logger.warn(`User with email ${email} not found`);
            return next(
                new AppError(
                    'If a user with that email is registered, an email will be sent to reset the password',
                    HttpStatusCodes.OK
                )
            );
        }

        if (!user.verified) {
            logger.warn(`User with email ${email} not verified`);
            return next(
                new AppError(
                    'The user with that email is not verified',
                    HttpStatusCodes.OK
                )
            );
        }

        const passwordResetCode = nanoid();

        user.passwordResetCode = passwordResetCode;

        await user.save();

        await sendEmail({
            from: 'example@test.com',
            to: email,
            subject: 'Reset your password',
            text: `Reset code: ${passwordResetCode} id: ${user._id}`,
        });
        logger.warn(`Password reset code sent to ${email}`);

        res.status(HttpStatusCodes.OK).json({
            status: 'success',
            message:
                'If a user with that email is registered, an email will be sent to reset the password',
        });
    }
);

export const resetPasswordHandler = asyncHandler(
    async (
        req: Request<
            ResetPasswordInput['params'],
            {},
            ResetPasswordInput['body']
        >,
        res,
        next
    ) => {
        const { id, resetCode } = req.params;
        const { password } = req.body;

        const user = await findUserById(id);

        if (
            !user ||
            !user.passwordResetCode ||
            user.passwordResetCode !== resetCode
        ) {
            logger.warn('Password reset code is incorrect');
            return next(
                new AppError(
                    'Could not reset password',
                    HttpStatusCodes.BAD_REQUEST
                )
            );
        }

        user.passwordResetCode = null;
        user.password = password;

        await user.save();

        await sendEmail({
            from: 'example@test.com',
            to: user.email,
            subject: 'Your password has been reset',
            text: `Hi, ${user.firstName} ${user.lastName}. Your password has been reset. Please login with your new password.`,
        });

        res.status(HttpStatusCodes.OK).json({
            status: 'success',
            message: 'Password reset successfully',
        });
    }
);

export const getCurrentUserHandler = asyncHandler(async (req, res, next) => {
    const user = res.locals.user;

    if (user) {
        res.status(HttpStatusCodes.OK).json({
            status: 'success',
            data: {
                user: user,
            },
            message: 'User found',
        });
    } else {
        res.status(HttpStatusCodes.OK).json({
            status: 'success',
            data: {},
            message: 'User not found',
        });
    }
});
