import { Company, CompanyModel } from '../models/company.model';
import { UpdateQuery } from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';
import ApiFeatures from '../utils/ApiFeatures';

export const createCompany = async (input: Partial<Company>) => {
    const company = await CompanyModel.create(input);
    return company;
};

export const updateCompany = async (
    id: string,
    input: UpdateQuery<DocumentType<Company>>
) => {
    const company = await CompanyModel.findByIdAndUpdate(id, input, {
        new: true,
    });
    return company;
};

export const findAllCompanies = async (query: Object) => {
    const companies = await new ApiFeatures(CompanyModel.find(), query)
        .filter()
        .sort()
        .paginate()
        .limitFields().query;
    return companies;
};
