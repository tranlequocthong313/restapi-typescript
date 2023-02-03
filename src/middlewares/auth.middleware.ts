import { NextFunction, Request, Response } from 'express';
import { HttpError } from '.';
import { jwt } from '../utils';
import config from '../../config';

const authorize = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    if (!authorization) return next(new HttpError(401, 'Unauthorized'));

    const token = authorization.split(' ')[1];
    const decoded = jwt.verifyToken(token, config.JWT.ACCESS_TOKEN_SECRET);
    if (!decoded) return next(new HttpError(401, 'Unauthorized'));

    res.locals.payload = decoded;
    next();
};

export default authorize;
