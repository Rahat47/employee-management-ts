import { Router } from 'express';
import {
    createSessionHandler,
    logoutHandler,
    refreshAccessTokenHandler,
} from '../controllers/auth.controller';
import requireUser from '../middlewares/requireUser';
import validateReource from '../middlewares/validateResource';
import { createSessionSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/session/refresh', refreshAccessTokenHandler);
router.post(
    '/session',
    validateReource(createSessionSchema),
    createSessionHandler
);

router.delete('/session/logout', requireUser, logoutHandler);

export default router;
