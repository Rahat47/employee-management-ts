import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
    body: object({
        firstName: string({
            required_error: 'First name is required',
            description: 'First name of the user',
        }),

        lastName: string({
            required_error: 'Last name is required',
            description: 'Last name of the user',
        }),

        email: string({
            required_error: 'Email is required',
            description: 'Email of the user',
        }).email({ message: 'Email is not valid' }),

        password: string({
            required_error: 'Password is required',
        }).min(6, 'Password must be at least 6 characters long'),

        passwordConfirm: string({
            required_error: 'Password confirmation is required',
        }),
    }).refine(data => data.password === data.passwordConfirm, {
        message: 'Passwords do not match',
        path: ['passwordConfirmation'],
    }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];

export const verifyUserSchema = object({
    params: object({
        id: string({
            required_error: 'User id is required',
        }),
        verificationCode: string({
            required_error: 'Verification code is required',
        }),
    }),
});

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>['params'];
