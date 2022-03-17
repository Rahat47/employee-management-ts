import { Router } from 'express';
import {
    createUserHandler,
    forgotPasswordHandler,
    getCurrentUserHandler,
    resetPasswordHandler,
    verifyUserHandler,
} from '../controllers/user.controller';
import validateReource from '../middlewares/validateResource';
import {
    createUserSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verifyUserSchema,
} from '../schemas/user.schema';

const router = Router();

router.get('/me', getCurrentUserHandler);

router.route('/').post(validateReource(createUserSchema), createUserHandler);

router.get(
    '/verify/:id/:verificationCode',
    validateReource(verifyUserSchema),
    verifyUserHandler
);

router.post(
    '/forgot-password',
    validateReource(forgotPasswordSchema),
    forgotPasswordHandler
);

router.post(
    '/reset-password/:id/:resetCode',
    validateReource(resetPasswordSchema),
    resetPasswordHandler
);
export default router;
