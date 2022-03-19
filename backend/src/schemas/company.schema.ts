import { array, number, object, string, TypeOf } from 'zod';

export const createCompanySchema = object({
    body: object({
        companyName: string({
            required_error: 'Company name is required',
        }),
        companyNameKana: string({
            required_error: 'Company name kana is required',
        }),
        zipCode: number({
            required_error: 'Zip code is required',
        }),
        address: string({
            required_error: 'Company Address is required',
        }),
        telephoneNumber: string({
            required_error: 'Telephone number is required',
        }),
        email: string({
            required_error: 'Email is required',
        }).email('Please enter a valid email address'),
        url: string().optional(),
        dateOfEstablishment: string().refine(
            (value: string) => new Date(value).toString() !== 'Invalid Date',
            'Please enter a valid date'
        ),
        remarks: string().optional(),
        images: array(string()).default([]),
    }),
});

export type CreateCompanyInput = TypeOf<typeof createCompanySchema>['body'];
