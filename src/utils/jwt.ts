import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import logger from './logger';
import { redis } from '../databases';
import { get } from 'lodash';

const signToken = (payload: object, keySecret: string, options?: SignOptions | undefined): string => {
    return jwt.sign(payload, keySecret, options);
};

const verifyToken = (token: string, keySecret: string): string | JwtPayload | null => {
    try {
        return jwt.verify(token, keySecret);
    } catch (error) {
        logger.error(`JWT ERROR:::${error}`);
        return null;
    }
};

const verifyRefreshToken = async (token: string, keySecret: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, keySecret, async (err, payload) => {
            if (err) reject(new Error('Invalid token'));

            const _id = get(payload, '_id');
            if (!_id) return reject(new Error('Invalid token'));

            const cachedToken = await redis.get(_id).catch(err => {
                logger.error(err);
                reject(new Error('Internal server error'));
            });

            if (cachedToken === token) {
                resolve(payload);
            }
            reject(new Error('Invalid token'));
        });
    });
};

export { signToken, verifyToken, verifyRefreshToken };
