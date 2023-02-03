"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = exports.responseErrors = exports.notFound = void 0;
const utils_1 = require("../utils");
const path_1 = __importDefault(require("path"));
const utils_2 = require("../utils");
const config_1 = __importDefault(require("../../config"));
class HttpError extends Error {
    constructor(statusCode = 500, message = 'Internal server error') {
        super(message);
        this.statusCode = statusCode;
        this.statusCode = statusCode;
    }
}
exports.HttpError = HttpError;
const notFound = (req, res, next) => {
    next(new HttpError(404, 'Not found'));
};
exports.notFound = notFound;
const responseErrors = (err, req, res, next) => {
    handleError(err, req, res);
};
exports.responseErrors = responseErrors;
const handleError = (err, req, res) => {
    log(err, req);
    const code = err.statusCode || 500;
    const message = err.message && err.statusCode != 500 ? err.message : 'Internal server error';
    (0, utils_1.HttpResponse)(res, { code, message });
};
const log = (err, req) => {
    if (config_1.default.SERVER.NODE_ENV === 'test')
        return;
    utils_1.logger.error(err);
    (0, utils_2.logIntoFile)(`${req.method} --- ${req.url} --- ${err.statusCode} --- ${err.stack}`, getFileName());
};
const getFileName = () => config_1.default.SERVER.NODE_ENV === 'development'
    ? path_1.default.join(__dirname, '../logs', 'error.dev.log')
    : path_1.default.join(__dirname, '../logs', 'error.prod.log');
