"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutSchema = exports.loginSchema = exports.registerSchema = exports.reissueTokenSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().required(),
    password: joi_1.default.string().required()
});
exports.loginSchema = loginSchema;
const registerSchema = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().required(),
    name: joi_1.default.string().required().regex(/[$\(\)<>]/, { invert: true }),
    password: joi_1.default.string().min(6).required(),
    passwordConfirmation: joi_1.default.any().equal(joi_1.default.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' })
});
exports.registerSchema = registerSchema;
const reissueTokenSchema = joi_1.default.object({
    refreshToken: joi_1.default.string().required()
});
exports.reissueTokenSchema = reissueTokenSchema;
const logoutSchema = joi_1.default.object({
    refreshToken: joi_1.default.string().required()
});
exports.logoutSchema = logoutSchema;
