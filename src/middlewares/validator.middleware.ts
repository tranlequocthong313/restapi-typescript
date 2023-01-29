import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';
import { HttpError } from './';

class InvalidHTTPResource extends HttpError {
}

const validate = (validator: Schema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const validated = await validator.validateAsync(req.body)
            .catch(err => next(new InvalidHTTPResource(422, err.message)));
        req.body = validated;
        next();
    };
};

export default validate;
