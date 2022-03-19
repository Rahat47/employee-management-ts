import { Company, CompanyModel } from '../models/company.model';

export const createCompany = async (input: Partial<Company>) => {
    const company = await CompanyModel.create(input);
    return company;
};
