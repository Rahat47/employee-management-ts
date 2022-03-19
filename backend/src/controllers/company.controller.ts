import type { Request } from 'express';

import asyncHandler from 'express-async-handler';
import { omit } from 'lodash';
import { HttpStatusCodes } from '../constants/httpStatusCodes';
import {
    CreateCompanyInput,
    UpdateCompanyInput,
} from '../schemas/company.schema';
import {
    createCompany,
    findAllCompanies,
    updateCompany,
} from '../services/company.service';

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

export const updateCompanyHandler = asyncHandler(
    async (
        req: Request<
            UpdateCompanyInput['params'],
            {},
            UpdateCompanyInput['body']
        >,
        res,
        next
    ) => {
        const { id } = req.params;
        const { dateOfEstablishment } = req.body;
        const dateOfEstablishmentDate = dateOfEstablishment
            ? new Date(dateOfEstablishment)
            : null;

        const data = omit(req.body, [
            'dateOfEstablishment',
            'remarks',
            'images',
            'email',
        ]);

        const payload = {
            ...data,
            ...(dateOfEstablishmentDate
                ? { dateOfEstablishment: dateOfEstablishmentDate }
                : {}),
        };

        const company = await updateCompany(id, payload);

        res.status(HttpStatusCodes.OK).json({
            status: 'success',
            data: {
                company,
            },
            message: 'Company updated successfully',
        });
    }
);

export const getCompaniesHandler = asyncHandler(async (req, res, next) => {
    const companies = await findAllCompanies(req.query);

    res.status(HttpStatusCodes.OK).json({
        status: 'success',
        data: {
            companies,
        },
        message: 'Companies fetched successfully',
    });
});
