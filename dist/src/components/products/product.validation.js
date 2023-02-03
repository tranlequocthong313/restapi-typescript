"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const productSchema = joi_1.default.object({
    title: joi_1.default.string().min(2).required().regex(/[$\(\)<>]/, { invert: true }),
    description: joi_1.default.string().min(50).required().regex(/[$\(\)<>]/, { invert: true }),
    price: joi_1.default.number().required().min(0),
    image: joi_1.default.string().required()
});
exports.default = productSchema;
