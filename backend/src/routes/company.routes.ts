import { Router } from 'express';
import { createCompanyHandler } from '../controllers/company.controller';
import requireUser from '../middlewares/requireUser';
import { restrictRole } from '../middlewares/restrictResource';
import validateReource from '../middlewares/validateResource';
import { userRoles } from '../models/user.model';
import { createCompanySchema } from '../schemas/company.schema';

const router = Router();

router
    .route('/')
    .post(
        validateReource(createCompanySchema),
        requireUser,
        restrictRole(userRoles.systemAdmin, userRoles.administrativeAuthority),
        createCompanyHandler
    );

export default router;
