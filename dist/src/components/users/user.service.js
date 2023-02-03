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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const utils_1 = require("../../utils");
const databases_1 = require("../../databases");
const config_1 = __importDefault(require("../../../config"));
class UserService {
    logout(refreshToken) {
        return utils_1.jwt.verifyRefreshToken(refreshToken, config_1.default.JWT.REFRESH_TOKEN_SECRET)
            .then((payload) => __awaiter(this, void 0, void 0, function* () { return yield databases_1.redis.del(payload._id.toString()); }))
            .catch((err) => { throw new Error(err.message); });
    }
    reIssueTokenPair(refreshToken) {
        return utils_1.jwt.verifyRefreshToken(refreshToken, config_1.default.JWT.REFRESH_TOKEN_SECRET)
            .then((payload) => __awaiter(this, void 0, void 0, function* () { return yield this.getTokens({ _id: payload._id }); }))
            .catch(err => { throw new Error(err.message); });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new _1.UserModel(user).save()
                .catch(() => { throw new Error('Some error occurred while creating the user.'); });
        });
    }
    findOne(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield _1.UserModel.findOne(query, null, options);
            if (!user)
                throw new Error('User not found');
            return user;
        });
    }
    getUserWithTokenPair(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return Object.assign({ _id: user._id, email: user.email, name: user.name, createdAt: user.createdAt, updatedAt: user.updatedAt }, (yield this.getTokens({ _id: user._id })));
        });
    }
    getTokens(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const [accessToken, refreshToken] = [
                utils_1.jwt.signToken(payload, config_1.default.JWT.ACCESS_TOKEN_SECRET, { expiresIn: config_1.default.JWT.ACCESS_EXPIRES_IN }),
                utils_1.jwt.signToken(payload, config_1.default.JWT.REFRESH_TOKEN_SECRET, { expiresIn: config_1.default.JWT.REFRESH_EXPIRES_IN })
            ];
            yield databases_1.redis.set(payload._id, refreshToken, 'EX', config_1.default.JWT.REFRESH_EXPIRES_IN);
            return { accessToken, refreshToken };
        });
    }
}
exports.default = UserService;
