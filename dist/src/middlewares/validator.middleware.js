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
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
class InvalidHTTPResource extends _1.HttpError {
}
const validate = (validator) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const validated = yield validator.validateAsync(req.body)
            .catch(err => next(new InvalidHTTPResource(422, err.message)));
        req.body = validated;
        next();
    });
};
exports.default = validate;
