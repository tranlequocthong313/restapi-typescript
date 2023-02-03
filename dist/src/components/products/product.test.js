"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const mongoose_1 = __importStar(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const _1 = require(".");
const utils_1 = require("../../utils");
const config_1 = __importDefault(require("../../../config"));
const product_test_cases_1 = require("./product.test.cases");
const productPayload = {
    title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
    description: "Designed for first-time DSLR owners who want impressive results straight out of the box,\
    Designed for first - time DSLR owners who want impressive results straight out of the box",
    price: 879.99,
    image: "https://i.imgur.com/QlRphfQ.jpg",
};
const notExistProductId = '63d6460a95d7c852b8be9d58';
let client;
let product;
let userId;
let accessToken;
let productService;
describe('product tests', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        yield mongoose_1.default.connect(mongoServer.getUri());
        client = (0, supertest_1.default)(app_1.default);
        userId = new mongoose_1.Types.ObjectId().toString();
        accessToken = utils_1.jwt.signToken({ _id: userId }, config_1.default.JWT.ACCESS_TOKEN_SECRET);
        productService = new _1.ProductService();
        product = yield productService.create(Object.assign(Object.assign({}, productPayload), { userId }));
    }));
    afterAll(() => Promise.all([
        mongoose_1.default.disconnect(),
        mongoose_1.default.connection.close(),
    ]));
    describe('GET /api/products/:id', () => {
        describe('given a product id does not exist', () => {
            it("should respond with a 404 status code", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield client.get(`/api/products/${notExistProductId}`);
                expect(response.statusCode).toBe(404);
            }));
        });
        describe('given a product id does exist', () => {
            it("should response with a 200 status code and the product", () => __awaiter(void 0, void 0, void 0, function* () {
                const { body, statusCode } = yield client.get(`/api/products/${product._id.toString()}`);
                expect(statusCode).toBe(200);
                expect(body.data.productId).toEqual(product.productId);
                expect(body.data.description).toEqual(product.description);
                expect(body.data.image).toEqual(product.image);
                expect(body.data.price).toEqual(product.price);
                expect(body.data.userId).toEqual(product.userId.toString());
            }));
        });
    });
    describe('POST /api/products', () => {
        describe('given a user is not logged in', () => {
            it('should return a 401', () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode } = yield client.post("/api/products");
                expect(statusCode).toBe(401);
            }));
        });
        describe('given a user is logged in', () => {
            it('should return a 201 status code and a new product', () => __awaiter(void 0, void 0, void 0, function* () {
                const { body, statusCode } = yield client.post('/api/products')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send(productPayload);
                expect(statusCode).toBe(201);
                expect(body.data.description).toEqual(productPayload.description);
                expect(body.data.image).toEqual(productPayload.image);
                expect(body.data.price).toEqual(productPayload.price);
                expect(body.data.userId).toEqual(userId.toString());
            }));
        });
        describe('given invalid or missing data bodies', () => {
            it('should return a 422 status code', () => {
                product_test_cases_1.FAILED_CASE_BODIES.forEach((body) => __awaiter(void 0, void 0, void 0, function* () {
                    const { statusCode } = yield client.post('/api/products')
                        .set('Authorization', `Bearer ${accessToken}`)
                        .send(body);
                    expect(statusCode).toBe(422);
                }));
            });
        });
    });
    describe('PUT /api/products/:id', () => {
        describe('given a product id does not exist', () => {
            it('should respond a 404 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode, body } = yield client.put(`/api/products/${notExistProductId}`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send(productPayload);
                expect(statusCode).toBe(404);
            }));
        });
        describe('given a user is not logged in', () => {
            it('should respond a 401', () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode } = yield client.put(`/api/products/${product._id.toString()}`);
                expect(statusCode).toBe(401);
            }));
        });
        describe('given a user is logged in', () => {
            it('should respond a 200 status code and a updated product', () => __awaiter(void 0, void 0, void 0, function* () {
                const updateProductPayload = {
                    title: "Macbook Pro 2023",
                    description: "Designed for first-time DSLR owners who want impressive results straight out of the box,\
                    Designed for first - time DSLR owners who want impressive results straight out of the box",
                    price: 1499,
                    image: "https://i.imgur.com/QlRphfQ.jpg",
                };
                const { body, statusCode } = yield client.put(`/api/products/${product._id.toString()}`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send(updateProductPayload);
                expect(statusCode).toBe(200);
                expect(body.data.description).toEqual(updateProductPayload.description);
                expect(body.data.image).toEqual(updateProductPayload.image);
                expect(body.data.price).toEqual(updateProductPayload.price);
                expect(body.data.userId).toEqual(userId.toString());
            }));
        });
        describe('given invalid or missing data bodies', () => {
            it('should respond a 422 status code', () => {
                product_test_cases_1.FAILED_CASE_BODIES.forEach((body) => __awaiter(void 0, void 0, void 0, function* () {
                    const { statusCode } = yield client.put(`/api/products/${product._id.toString()}`)
                        .set('Authorization', `Bearer ${accessToken}`)
                        .send(body);
                    expect(statusCode).toBe(422);
                }));
            });
        });
    });
    describe('DELETE /api/products/:id', () => {
        describe('give a product id does not exist', () => {
            it('should respond a 404 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode } = yield client.delete(`/api/products/${notExistProductId}`)
                    .set('Authorization', `Bearer ${accessToken}`);
                expect(statusCode).toBe(404);
            }));
        });
        describe('given a user is not logged in', () => {
            it('should respond a 401 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode } = yield client.delete(`/api/products/${product._id.toString()}`);
                expect(statusCode).toBe(401);
            }));
        });
        describe('given a user is logged in', () => {
            it('should respond a 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode } = yield client.delete(`/api/products/${product._id.toString()}`)
                    .set('Authorization', `Bearer ${accessToken}`);
                expect(statusCode).toBe(200);
            }));
        });
    });
});
