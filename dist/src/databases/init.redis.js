"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = require("ioredis");
const utils_1 = require("../utils");
const config_1 = __importDefault(require("../../config"));
const redis = new ioredis_1.Redis(config_1.default.REDIS.PORT, config_1.default.REDIS.HOST);
redis.on('connect', () => utils_1.logger.info('Connected to redis'));
redis.on('error', (err) => utils_1.logger.error(`Redis error:::${err}`));
exports.default = redis;
