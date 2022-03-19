import express from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import companyRoutes from './company.routes';
import globalErrorHandler from '../middlewares/globalErrorHandler';

const router = express.Router();

router.get('/healthcheck', (_, res) => {
    res.sendStatus(200);
});

router.use('/api/v1/users', userRoutes);
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/companies', companyRoutes);

router.use(globalErrorHandler);

export default router;
