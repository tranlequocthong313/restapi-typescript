"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const utils_1 = require("../utils");
const HOST = config_1.default.MONGODB.HOST;
const PORT = config_1.default.MONGODB.PORT;
const DB_NAME = config_1.default.MONGODB.DB_NAME;
const DEBUG = config_1.default.MONGODB.DEBUG;
const connectToDB = () => {
    mongoose_1.default.set('debug', DEBUG);
    mongoose_1.default.set('strictQuery', true);
    mongoose_1.default.connection.on('connected', () => utils_1.logger.info(`Connected to mongodb`));
    mongoose_1.default.connection.on('error', (error) => utils_1.logger.error(`Mongodb error:::${error}`));
    mongoose_1.default.connect(`mongodb://${HOST}:${PORT}/${DB_NAME}`);
};
exports.default = connectToDB;
