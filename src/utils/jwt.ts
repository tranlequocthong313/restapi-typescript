import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { redis } from '../databases';

const signToken = (payload: object, keySecret: string, options?: SignOptions | undefined): string => {
    return jwt.sign(payload, keySecret, options);
};

const verifyToken = (token: string, keySecret: string): string | JwtPayload | null => {
    return jwt.verify(token, keySecret);
};

const verifyRefreshToken = async (token: string, keySecret: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, keySecret, (err, payload: any) => {
            if (err) reject(new Error(err.message));

            redis.get(payload._id)
                .then(cachedToken => {
                    if (cachedToken === token) resolve(payload);
                    reject(new Error('Invalid token'));
                })
                .catch(err => reject(new Error(err.message)));
        });
    });
};

export { signToken, verifyToken, verifyRefreshToken };
