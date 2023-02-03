"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const middlewares_1 = require("../../middlewares");
const express_1 = require("express");
const productRouter = (0, express_1.Router)();
const productService = new _1.ProductService();
const productController = new _1.ProductController(productService);
productRouter.get('/:productId', productController.getProduct.bind(productController));
// Authorize from here
productRouter.use(middlewares_1.authorize);
productRouter.delete('/:productId', productController.deleteProduct.bind(productController));
// Validate user's input from here
productRouter.use((0, middlewares_1.validate)(_1.productSchema));
productRouter.post('', productController.createProduct.bind(productController));
productRouter.put('/:productId', productController.updateProduct.bind(productController));
exports.default = productRouter;
