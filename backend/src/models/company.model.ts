import { getModelForClass, prop, index } from '@typegoose/typegoose';

@index<Company>({
    email: 1,
    companyNameKana: 1,
})
export class Company {
    @prop({ required: true })
    companyName: string;

    @prop({ required: true })
    companyNameKana: string;

    @prop({
        required: true,
    })
    zipCode: number;

    @prop({
        required: true,
        maxlength: 120,
    })
    address: string;

    @prop({
        required: true,
    })
    telephoneNumber: string;

    @prop({
        required: true,
        unique: true,
        lowercase: true,
    })
    email: string;

    @prop({
        default: '',
    })
    url: string;

    @prop({
        default: new Date(),
        type: Date,
    })
    dateOfEstablishment: Date;

    @prop({
        default: '',
    })
    remarks: string;

    @prop({
        default: [],
    })
    images: string[];
}

export const CompanyModel = getModelForClass(Company, {
    schemaOptions: {
        timestamps: true,
    },
});
