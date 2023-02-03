"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("./components/users");
const products_1 = require("./components/products");
const router = (0, express_1.Router)();
router.use('/users', users_1.userRouter);
router.use('/products', products_1.productRouter);
exports.default = router;
