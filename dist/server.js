"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./src/app"));
const config_1 = __importDefault(require("./config"));
const utils_1 = require("./src/utils");
const databases_1 = require("./src/databases");
const PORT = config_1.default.SERVER.PORT;
app_1.default.listen(PORT, () => {
    utils_1.logger.info(`Sever is running on port:::${PORT}`);
    (0, databases_1.connectToDB)();
});
