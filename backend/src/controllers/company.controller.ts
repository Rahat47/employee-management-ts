import type { Request } from 'express';

import asyncHandler from 'express-async-handler';
import { HttpStatusCodes } from '../constants/httpStatusCodes';
import { CreateCompanyInput } from '../schemas/company.schema';
import { createCompany } from '../services/company.service';

export const createCompanyHandler = asyncHandler(
    async (req: Request<{}, {}, CreateCompanyInput>, res, next) => {
        const { dateOfEstablishment } = req.body;
        const dateOfEstablishmentDate = new Date(dateOfEstablishment);

        const payload = {
            ...req.body,
            dateOfEstablishment: dateOfEstablishmentDate,
        };

        const company = await createCompany(payload);

        res.status(HttpStatusCodes.CREATED).json({
            status: 'success',
            data: {
                company,
            },
            message: 'Company created successfully',
        });
    }
);
