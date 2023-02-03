"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const productSchema = new mongoose_1.Schema({
    productId: { type: String, unique: true, required: true, default: () => `product:${(0, uuid_1.v4)()}` },
    userId: { type: mongoose_1.Types.ObjectId, ref: 'user' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
}, {
    timestamps: true
});
const ProductModel = (0, mongoose_1.model)('product', productSchema);
exports.default = ProductModel;
