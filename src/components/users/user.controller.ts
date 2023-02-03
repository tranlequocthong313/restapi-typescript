import { NextFunction, Request, Response } from 'express';
import { IUserService } from '.';
import { HttpResponse } from '../../utils';
import { HttpError } from '../../middlewares';

class UserController {
    constructor(private userService: IUserService) {
        this.userService = userService;
    }

    signup(req: Request, res: Response, next: NextFunction) {
        try {
            this.userService.findOne({ email: req.body.email })
                .then(() => next(new HttpError(409, 'Email already in use')))
                .catch(() => {
                    this.userService.createUser(req.body)
                        .then(async user => HttpResponse(res, {
                            code: 201,
                            message: 'Signed up successfully',
                            data: await this.userService.getUserWithTokenPair(user)
                        }))
                        .catch(error => next(new HttpError(500, error.message)));
                });
        } catch (error: any) {
            next(new HttpError(500, error.message));
        }
    }

    signIn(req: Request, res: Response, next: NextFunction) {
        try {
            this.userService.findOne({ email: req.body.email })
                .then(async (user) => {
                    const isCorrectPassword = await user.comparePassword(req.body.password);
                    if (!isCorrectPassword) next(new HttpError(403, 'Email or password is in correct'));

                    HttpResponse(res, {
                        code: 200,
                        message: 'Signed in successfully',
                        data: await this.userService.getUserWithTokenPair(user)
                    });
                })
                .catch(() => next(new HttpError(403, 'Email or password is incorrect')));
        } catch (error: any) {
            next(new HttpError(500, error.message));
        }
    }


    logout(req: Request, res: Response, next: NextFunction) {
        try {
            this.userService.logout(req.body.refreshToken)
                .then(() => HttpResponse(res, { code: 200, message: 'Logout successfully' }))
                .catch((err) => next(new HttpError(401, err.message)));
        } catch (error: any) {
            next(new HttpError(500, error.message));
        }
    }


    reIssueToken(req: Request, res: Response, next: NextFunction) {
        try {
            this.userService.reIssueTokenPair(req.body.refreshToken)
                .then((token) => HttpResponse(res, {
                    code: 201,
                    message: 'Refreshed token successfully',
                    data: token
                }))
                .catch(err => next(new HttpError(401, err.message)));
        } catch (error: any) {
            next(new HttpError(500, error.message));
        }
    }
}


export default UserController;
