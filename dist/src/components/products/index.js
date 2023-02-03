"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = exports.productSchema = exports.ProductController = exports.ProductService = exports.ProductModel = void 0;
const product_model_1 = __importDefault(require("./product.model"));
exports.ProductModel = product_model_1.default;
const product_service_1 = __importDefault(require("./product.service"));
exports.ProductService = product_service_1.default;
const product_validation_1 = __importDefault(require("./product.validation"));
exports.productSchema = product_validation_1.default;
const product_controller_1 = __importDefault(require("./product.controller"));
exports.ProductController = product_controller_1.default;
const product_router_1 = __importDefault(require("./product.router"));
exports.productRouter = product_router_1.default;
