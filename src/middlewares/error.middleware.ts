import { NextFunction, Request, Response } from 'express';
import { HttpResponse, logger } from '../utils';
import path from 'path';
import { logIntoFile } from '../utils';

class HttpError extends Error {
    constructor(public statusCode = 500, message = 'Internal server error') {
        super(message);
        this.statusCode = statusCode;
    }
}

const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(new HttpError(404, 'Not found'));
};

const filename = path.join(__dirname, '../logs', 'error.log');
const responseErrors = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logIntoFile(`${req.url} --- ${req.method} --- ${err.message}`, filename);

    const code = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    return new HttpResponse(res, { code, message });
};

export { notFound, responseErrors, HttpError };
