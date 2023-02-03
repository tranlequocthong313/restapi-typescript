"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const databases_1 = require("../databases");
const signToken = (payload, keySecret, options) => {
    return jsonwebtoken_1.default.sign(payload, keySecret, options);
};
exports.signToken = signToken;
const verifyToken = (token, keySecret) => {
    return jsonwebtoken_1.default.verify(token, keySecret);
};
exports.verifyToken = verifyToken;
const verifyRefreshToken = (token, keySecret) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, keySecret, (err, payload) => {
            if (err)
                reject(new Error(err.message));
            databases_1.redis.get(payload._id)
                .then(cachedToken => {
                if (cachedToken === token)
                    resolve(payload);
                reject(new Error('Invalid token'));
            })
                .catch(err => reject(new Error(err.message)));
        });
    });
});
exports.verifyRefreshToken = verifyRefreshToken;
