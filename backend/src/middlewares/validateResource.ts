import { AnyZodObject, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
const validateReource =
    (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
        const { body, query, params } = req;
        try {
            schema.parse({
                body,
                query,
                params,
            });
            next();
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                error: error.errors,
            });
        }
    };

export default validateReource;
