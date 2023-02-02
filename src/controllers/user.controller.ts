import { NextFunction, Request, Response } from 'express';
import { IUserService } from '../services';
import { HttpResponse, logger } from '../utils';
import { HttpError } from '../middlewares';

class UserController {
    constructor(private userService: IUserService) {
        this.userService = userService;
    }

    async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const userExist = await this.userService.findOne({ email: req.body.email });
            if (userExist) return next(new HttpError(409, 'Email already in use'));

            const user = await this.userService.createUser(req.body);
            return HttpResponse(res, {
                code: 201,
                message: 'Signed up successfully',
                data: await this.userService.getUserWithTokenPair(user)
            });
        } catch (error) {
            logger.error(error);
            next(new HttpError());
        }
    }

    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userService.findOne({ email: req.body.email });
            if (!user) return next(new HttpError(403, 'Email or password is incorrect'));

            const isCorrectPassword = await user.comparePassword(req.body.password);
            if (!isCorrectPassword) return next(new HttpError(403, 'Email or password is incorrect'));

            return HttpResponse(res, {
                code: 200,
                message: 'Signed in successfully',
                data: await this.userService.getUserWithTokenPair(user)
            });
        } catch (error) {
            logger.error(error);
            next(new HttpError());
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            await this.userService.logout(req.body.refreshToken);
            return HttpResponse(res, { code: 200, message: 'Logout successfully' });
        } catch (error: any) {
            logger.error(error);
            next(new HttpError(401, error.message));
        }
    }

    async reIssueToken(req: Request, res: Response, next: NextFunction) {
        try {
            return HttpResponse(res, {
                code: 201,
                message: 'Refreshed token successfully',
                data: await this.userService.reIssueTokenPair(req.body.refreshToken)
            });
        } catch (error: any) {
            logger.error(error);
            next(new HttpError(401, error.message));
        }
    }
}


export default UserController;
