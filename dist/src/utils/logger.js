"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logIntoFile = void 0;
const pino_1 = __importDefault(require("pino"));
const pino_pretty_1 = __importDefault(require("pino-pretty"));
const date_fns_1 = require("date-fns");
const promises_1 = __importDefault(require("fs/promises"));
const logger = (0, pino_1.default)((0, pino_pretty_1.default)());
function logIntoFile(msg, filename) {
    const dateTime = `${(0, date_fns_1.format)(new Date(), 'dd-MM-yyyy\tHH:mm:ss')}`;
    const contentLog = `${dateTime}-----${msg}\n`;
    promises_1.default.appendFile(filename, contentLog).catch(err => logger.error(err));
}
exports.logIntoFile = logIntoFile;
;
exports.default = logger;
