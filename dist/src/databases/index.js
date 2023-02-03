"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = exports.connectToDB = void 0;
const init_mongodb_1 = __importDefault(require("./init.mongodb"));
exports.connectToDB = init_mongodb_1.default;
const init_redis_1 = __importDefault(require("./init.redis"));
exports.redis = init_redis_1.default;
