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
const utils_1 = require("../../utils");
const middlewares_1 = require("../../middlewares");
class ProductController {
    constructor(productService) {
        this.productService = productService;
        this.productService = productService;
    }
    createProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, utils_1.HttpResponse)(res, {
                    code: 201,
                    message: 'Created successfully',
                    data: yield this.productService.create(Object.assign(Object.assign({}, req.body), { userId: res.locals.payload._id }))
                });
            }
            catch (error) {
                next(new middlewares_1.HttpError(500, error.message));
            }
        });
    }
    updateProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedProduct = yield this.productService.findOneAndUpdate({
                    _id: req.params.productId,
                    userId: res.locals.payload._id
                }, req.body, { new: true });
                if (!updatedProduct)
                    return next(new middlewares_1.HttpError(404, 'Not found'));
                (0, utils_1.HttpResponse)(res, { code: 200, message: 'Updated successfully', data: updatedProduct });
            }
            catch (error) {
                console.error('UPDATE:::', error);
                next(new middlewares_1.HttpError(500, error.message));
            }
        });
    }
    getProduct(req, res, next) {
        try {
            this.productService.findOne({ _id: req.params.productId })
                .then(product => (0, utils_1.HttpResponse)(res, {
                code: 200,
                message: 'Get successfully',
                data: product
            }))
                .catch(err => next(new middlewares_1.HttpError(404, err.message)));
        }
        catch (error) {
            next(new middlewares_1.HttpError(500, error.message));
        }
    }
    deleteProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedProduct = yield this.productService.findOneAndDelete({
                    _id: req.params.productId,
                    userId: res.locals.payload._id
                });
                if (!deletedProduct)
                    return next(new middlewares_1.HttpError(404, 'Not found'));
                (0, utils_1.HttpResponse)(res, { code: 200, message: 'Deleted successfully' });
            }
            catch (error) {
                next(new middlewares_1.HttpError(500, error.message));
            }
        });
    }
}
exports.default = ProductController;
