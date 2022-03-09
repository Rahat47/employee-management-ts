import { Request } from 'express';
import asyncHandler from 'express-async-handler';
import { HttpStatusCodes } from '../constants/httpStatusCodes';
import { CreateUserInput, VerifyUserInput } from '../schemas/user.schema';
import { createUser, findUserById } from '../services/user.service';
import AppError from '../utils/AppError';
import sendEmail from '../utils/mailer';

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
                user,
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
