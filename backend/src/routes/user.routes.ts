import { Router } from 'express';
import {
    createUserHandler,
    verifyUserHandler,
} from '../controllers/user.controller';
import validateReource from '../middlewares/validateResource';
import { createUserSchema, verifyUserSchema } from '../schemas/user.schema';

const router = Router();

router.route('/').post(validateReource(createUserSchema), createUserHandler);

router.get(
    '/verify/:id/:verificationCode',
    validateReource(verifyUserSchema),
    verifyUserHandler
);

export default router;
