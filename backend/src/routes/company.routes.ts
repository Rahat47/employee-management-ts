import { Router } from 'express';
import {
    createCompanyHandler,
    getCompaniesHandler,
    updateCompanyHandler,
} from '../controllers/company.controller';
import requireUser from '../middlewares/requireUser';
import { restrictRole } from '../middlewares/restrictResource';
import validateReource from '../middlewares/validateResource';
import { userRoles } from '../models/user.model';
import {
    createCompanySchema,
    updateCompanySchema,
} from '../schemas/company.schema';

const router = Router();

router
    .route('/')
    .post(
        validateReource(createCompanySchema),
        requireUser,
        restrictRole(userRoles.systemAdmin, userRoles.administrativeAuthority),
        createCompanyHandler
    )
    .get(
        requireUser,
        restrictRole(userRoles.systemAdmin, userRoles.administrativeAuthority),
        getCompaniesHandler
    );

router
    .route('/:id')
    .patch(
        validateReource(updateCompanySchema),
        requireUser,
        restrictRole(userRoles.systemAdmin, userRoles.administrativeAuthority),
        updateCompanyHandler
    );

export default router;
