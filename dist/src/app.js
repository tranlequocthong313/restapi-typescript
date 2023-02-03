"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = __importDefault(require("../config"));
const middlewares_1 = require("./middlewares");
const compression_1 = __importDefault(require("compression"));
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
app
    .enable('trust proxy')
    .use((0, helmet_1.default)())
    .use(middlewares_1.apiLimiter)
    .use(express_1.default.json())
    .use((0, compression_1.default)())
    .use((0, morgan_1.default)(config_1.default.SERVER.MORGAN_STYLE))
    .use('/api', router_1.default)
    .use(middlewares_1.notFound)
    .use(middlewares_1.responseErrors);
exports.default = app;
