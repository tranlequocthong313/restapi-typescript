"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = __importDefault(require("../../config"));
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.default.SERVER.RATE_LIMIT_WINDOW,
    max: config_1.default.SERVER.RATE_LIMIT_MAX,
    standardHeaders: false,
    legacyHeaders: false,
});
exports.default = apiLimiter;
