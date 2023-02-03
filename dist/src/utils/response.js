"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpResponse = (res, data) => {
    return res.status(data.code).json(data);
};
exports.default = HttpResponse;
