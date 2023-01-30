import { NextFunction, Request, Response } from 'express';
import { IUserService } from '../services';
import { HttpResponse, jwt, logger } from '../utils';
import { HttpError } from '../middlewares';
import { redis } from '../databases';
import config from '../../config';
import { IUser } from '../models';
import { get } from 'lodash';

class UserController {
    constructor(private userService: IUserService) {
        this.userService = userService;
    }

    async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const userExist = await this.userService.findOne({ email: req.body.email });
            if (userExist) return next(new HttpError(409, 'Email already in use'));

            const user = await this.userService.createUser(req.body);
            const tokens = await this.getTokens({ _id: user._id });
            await redis.set(user._id.toString(), tokens.refreshToken, 'EX', config.JWT.REFRESH_EXPIRES_IN);

            return HttpResponse(res, {
                code: 201,
                message: 'Signed up successfully',
                data: this.getCleanedUserWithTokens(user, tokens)
            });
        } catch (error) {
            logger.error(error);
            next(new HttpError());
        }
    }

    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userService.findOne({ email: req.body.email });
            if (!user) return next(new HttpError(400, 'Email or password is incorrect'));

            const isCorrectPassword = await user.comparePassword(req.body.password);
            if (!isCorrectPassword) return next(new HttpError(400, 'Email or password is incorrect'));

            const tokens = await this.getTokens({ _id: user._id });
            await redis.set(user._id.toString(), tokens.refreshToken, 'EX', config.JWT.REFRESH_EXPIRES_IN);

            return HttpResponse(res, {
                code: 200,
                message: 'Signed in successfully',
                data: this.getCleanedUserWithTokens(user, tokens)
            });
        } catch (error) {
            logger.error(error);
            next(new HttpError());
        }
    }

    async reIssueToken(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = await jwt.verifyRefreshToken(req.body.refreshToken, config.JWT.REFRESH_TOKEN_SECRET);
            const tokens = await this.getTokens({ _id: payload._id });

            await redis.set(payload._id.toString(), tokens.refreshToken, 'EX', config.JWT.REFRESH_EXPIRES_IN);
            return HttpResponse(res, { code: 201, message: 'Refreshed token successfully', data: tokens });
        } catch (error: any) {
            logger.error(error);
            next(new HttpError(401, error.message));
        }
    }

    private async getTokens(payload: object): Promise<{ accessToken: string, refreshToken: string; }> {
        const [accessToken, refreshToken] = await Promise.all([
            await jwt.signToken(payload, config.JWT.ACCESS_TOKEN_SECRET, { expiresIn: config.JWT.ACCESS_EXPIRES_IN }),
            await jwt.signToken(payload, config.JWT.REFRESH_TOKEN_SECRET, { expiresIn: config.JWT.REFRESH_EXPIRES_IN })
        ]);

        return { accessToken, refreshToken };
    }

    private getCleanedUserWithTokens(user: IUser, tokens: { accessToken: string; refreshToken: string; }) {
        return {
            _id: user._id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            ...tokens
        };
    }
}


export default UserController;
