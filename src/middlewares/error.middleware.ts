import { NextFunction, Request, Response } from 'express';
import { HttpResponse, logger } from '../utils';
import path from 'path';
import { logIntoFile } from '../utils';
import config from '../../config';

class HttpError extends Error {
    constructor(public statusCode = 500, message = 'Internal server error') {
        super(message);
        this.statusCode = statusCode;
    }
}

const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(new HttpError(404, 'Not found'));
};

const responseErrors = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    handleError(err, req, res);
};

const handleError = (err: HttpError, req: Request, res: Response) => {
    log(err, req);

    const code = err.statusCode || 500;
    const message = err.message && err.statusCode != 500 ? err.message : 'Internal server error';

    HttpResponse(res, { code, message });
};

const log = (err: HttpError, req: Request) => {
    if (config.SERVER.NODE_ENV === 'test') return;

    logger.error(err);
    logIntoFile(`${req.method} --- ${req.url} --- ${err.statusCode} --- ${err.stack}`, getFileName());
};

const getFileName = () => config.SERVER.NODE_ENV === 'development'
    ? path.join(__dirname, '../logs', 'error.dev.log')
    : path.join(__dirname, '../logs', 'error.prod.log');

export { notFound, responseErrors, HttpError };
