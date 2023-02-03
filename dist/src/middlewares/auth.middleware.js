"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const utils_1 = require("../utils");
const config_1 = __importDefault(require("../../config"));
const authorize = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization)
        return next(new _1.HttpError(401, 'Unauthorized'));
    const token = authorization.split(' ')[1];
    const decoded = utils_1.jwt.verifyToken(token, config_1.default.JWT.ACCESS_TOKEN_SECRET);
    if (!decoded)
        return next(new _1.HttpError(401, 'Unauthorized'));
    res.locals.payload = decoded;
    next();
};
exports.default = authorize;
