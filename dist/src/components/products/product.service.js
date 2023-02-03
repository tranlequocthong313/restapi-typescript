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
const _1 = require(".");
const databases_1 = require("../../databases");
class ProductService {
    find(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _1.ProductModel.find(filter);
        });
    }
    create(product) {
        return _1.ProductModel.create(product)
            .then((createdProduct) => __awaiter(this, void 0, void 0, function* () {
            yield this.cacheProduct(createdProduct);
            return createdProduct;
        }))
            .catch(err => { throw new Error(err); });
    }
    findOne(filter, options = { lean: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedProduct = yield this.getCachedProduct(filter._id);
            if (cachedProduct)
                return JSON.parse(cachedProduct);
            const product = yield _1.ProductModel.findOne(filter, {}, options);
            if (!product)
                throw new Error('Product not found');
            yield this.cacheProduct(product);
            return product;
        });
    }
    findOneAndUpdate(filter, update, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedProduct = yield _1.ProductModel.findOneAndUpdate(filter, update, options);
            updatedProduct && (yield this.cacheProduct(updatedProduct));
            return updatedProduct;
        });
    }
    findOneAndDelete(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedProduct = yield _1.ProductModel.findOneAndDelete(filter, options);
            deletedProduct && (yield this.deleteCachedProduct(filter._id));
            return deletedProduct;
        });
    }
    cacheProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeToLive = 24 * 60 * 60; // 24 hours
            yield databases_1.redis.set(this.baseFormat(product._id), JSON.stringify(product), 'EX', timeToLive);
        });
    }
    getCachedProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield databases_1.redis.get(this.baseFormat(productId));
        });
    }
    deleteCachedProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield databases_1.redis.del(this.baseFormat(productId));
        });
    }
    baseFormat(productId) {
        return `product:::${productId}`;
    }
}
exports.default = ProductService;
