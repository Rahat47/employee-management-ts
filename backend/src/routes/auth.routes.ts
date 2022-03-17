import { Router } from 'express';
import { createSessionHandler } from '../controllers/auth.controller';
import validateReource from '../middlewares/validateResource';
import { createSessionSchema } from '../schemas/auth.schema';

const router = Router();

router.post(
    '/session',
    validateReource(createSessionSchema),
    createSessionHandler
);

export default router;
