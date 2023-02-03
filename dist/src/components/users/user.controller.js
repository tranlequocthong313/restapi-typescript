"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const middlewares_1 = require("../../middlewares");
class UserController {
    constructor(userService) {
        this.userService = userService;
        this.userService = userService;
    }
    signup(req, res, next) {
        try {
            this.userService.findOne({ email: req.body.email })
                .then(() => next(new middlewares_1.HttpError(409, 'Email already in use')))
                .catch(() => {
                this.userService.createUser(req.body)
                    .then((user) => __awaiter(this, void 0, void 0, function* () {
                    return (0, utils_1.HttpResponse)(res, {
                        code: 201,
                        message: 'Signed up successfully',
                        data: yield this.userService.getUserWithTokenPair(user)
                    });
                }))
                    .catch(error => next(new middlewares_1.HttpError(500, error.message)));
            });
        }
        catch (error) {
            next(new middlewares_1.HttpError(500, error.message));
        }
    }
    signIn(req, res, next) {
        try {
            this.userService.findOne({ email: req.body.email })
                .then((user) => __awaiter(this, void 0, void 0, function* () {
                const isCorrectPassword = yield user.comparePassword(req.body.password);
                if (!isCorrectPassword)
                    next(new middlewares_1.HttpError(403, 'Email or password is in correct'));
                (0, utils_1.HttpResponse)(res, {
                    code: 200,
                    message: 'Signed in successfully',
                    data: yield this.userService.getUserWithTokenPair(user)
                });
            }))
                .catch(() => next(new middlewares_1.HttpError(403, 'Email or password is incorrect')));
        }
        catch (error) {
            next(new middlewares_1.HttpError(500, error.message));
        }
    }
    logout(req, res, next) {
        try {
            this.userService.logout(req.body.refreshToken)
                .then(() => (0, utils_1.HttpResponse)(res, { code: 200, message: 'Logout successfully' }))
                .catch((err) => next(new middlewares_1.HttpError(401, err.message)));
        }
        catch (error) {
            next(new middlewares_1.HttpError(500, error.message));
        }
    }
    reIssueToken(req, res, next) {
        try {
            this.userService.reIssueTokenPair(req.body.refreshToken)
                .then((token) => (0, utils_1.HttpResponse)(res, {
                code: 201,
                message: 'Refreshed token successfully',
                data: token
            }))
                .catch(err => next(new middlewares_1.HttpError(401, err.message)));
        }
        catch (error) {
            next(new middlewares_1.HttpError(500, error.message));
        }
    }
}
exports.default = UserController;
