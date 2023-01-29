import { NextFunction, Request, Response } from 'express';
import { get } from 'lodash';
import { HttpError } from '.';
import { jwt, logger } from '../utils';
import config from '../../config';
import { signToken, verifyRefreshToken } from '../utils/jwt';
import { redis } from '../databases';

const authorize = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = get(req.headers, 'authorization', '').replace(/^Bearer\s/, "");
    if (!accessToken) return next(new HttpError(401, 'Unauthorized'));

    const decoded = jwt.verifyToken(accessToken, config.JWT.ACCESS_TOKEN_SECRET);

    if (!decoded) return next(new HttpError(401, 'Unauthorized'));

    res.locals.payload = decoded;

    next();
};

export default authorize;
