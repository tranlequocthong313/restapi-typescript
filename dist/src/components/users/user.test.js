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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const user_test_cases_1 = require("./user.test.cases");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = require(".");
const userPayload = {
    name: 'john doe',
    email: 'johndoe@gmail.com',
    password: 'password',
    passwordConfirmation: 'password',
};
const userAuth = {
    email: 'johndoe@gmail.com',
    password: 'password'
};
const nonExistUserPayload = {
    email: 'nonexist@gmail.com',
    password: 'password'
};
let client;
let refreshToken;
describe('user tests', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        yield mongoose_1.default.connect(mongoServer.getUri());
        client = (0, supertest_1.default)(app_1.default);
    }));
    afterAll(() => Promise.all([
        mongoose_1.default.disconnect(),
        mongoose_1.default.connection.close(),
    ]));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield client.post('/api/users/signup').send(userPayload);
        const { body } = yield client.post('/api/users/signin').send(userAuth);
        refreshToken = body.data.refreshToken;
    }));
    describe('POST /api/users/signin', () => {
        describe('given an invalid or missing email and password', () => {
            it("should response with a 422 status code", () => __awaiter(void 0, void 0, void 0, function* () {
                user_test_cases_1.SIGNIN_FAILED_CASE_BODIES.forEach((body) => __awaiter(void 0, void 0, void 0, function* () {
                    const response = yield client.post('/api/users/signin').send(body);
                    expect(response.statusCode).toBe(422);
                }));
            }));
        });
        describe('given a wrong email or password', () => {
            it("should respond with a 403 status code", () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode } = yield client.post('/api/users/signin').send(nonExistUserPayload);
                expect(statusCode).toBe(403);
            }));
        });
        describe('given a correct email and password', () => {
            it('should respond with a 200 status code and user data', () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode, body } = yield client.post('/api/users/signin').send(userAuth);
                expect(statusCode).toBe(200);
                expect(body.data.email).toBe(userPayload.email);
                expect(body.data.name).toBe(userPayload.name);
            }));
        });
    });
    describe('POST /api/users/signup', () => {
        describe('given an invalid or missing data body', () => {
            it("should respond with a 422 status code", () => __awaiter(void 0, void 0, void 0, function* () {
                user_test_cases_1.SIGNUP_FAILED_CASE_BODIES.forEach((body) => __awaiter(void 0, void 0, void 0, function* () {
                    const response = yield client.post('/api/users/signup').send(body);
                    expect(response.statusCode).toBe(422);
                }));
            }));
        });
        describe('given a correct data body', () => {
            it('should respond with a 201 status code and new user data', () => __awaiter(void 0, void 0, void 0, function* () {
                const userPayload = {
                    name: 'testuser',
                    email: 'test@gmail.com',
                    password: 'password',
                    passwordConfirmation: 'password'
                };
                const { statusCode, body } = yield client.post('/api/users/signup')
                    .send(userPayload);
                expect(statusCode).toBe(201);
                expect(body.data.name).toBe(userPayload.name);
                expect(body.data.email).toBe(userPayload.email);
            }));
        });
        describe('given a user has already existed', () => {
            it('should respond with a 409 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode } = yield client.post('/api/users/signup').send(userPayload);
                expect(statusCode).toBe(409);
            }));
        });
    });
    describe('UserModel', () => {
        describe('given a plain password', () => {
            it('should respond with a hash password', () => __awaiter(void 0, void 0, void 0, function* () {
                const userPayload = {
                    name: 'testusermodel',
                    email: 'testusermodel@gmail.com',
                    password: 'password',
                    passwordConfirmation: 'password'
                };
                const user = yield (new _1.UserModel(userPayload)).save();
                expect(user.password).not.toBe(userPayload.password);
                expect(user.password).toHaveLength(60); // Bcrypt's hash passwords have 60 chars
            }));
        });
    });
    describe('DELETE /api/users/logout', () => {
        describe('given a missing refresh token', () => {
            it('should respond a 422 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode } = yield client.delete('/api/users/logout').send({ refreshToken: '' });
                expect(statusCode).toBe(422);
            }));
        });
        describe('given a invalid refresh token', () => {
            it('should respond a 401 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const invalidRefreshToken = 'abcdef';
                const { statusCode } = yield client.delete('/api/users/logout').send({ refreshToken: invalidRefreshToken });
                expect(statusCode).toBe(401);
            }));
        });
        describe('given a valid refresh token', () => {
            it('should respond a 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode } = yield client.delete('/api/users/logout').send({ refreshToken });
                expect(statusCode).toBe(200);
            }));
        });
    });
    describe('POST /api/users/reissue-token', () => {
        describe('given a missing refresh token', () => {
            it('should respond a 422 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode } = yield client.post('/api/users/reissue-token').send({ refreshToken: '' });
                expect(statusCode).toBe(422);
            }));
        });
        describe('given an invalid refresh token', () => {
            it('should respond a 401 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode } = yield client.post('/api/users/reissue-token').send({ refreshToken: 'abcdedf' });
                expect(statusCode).toBe(401);
            }));
        });
        describe('given a correct refresh token', () => {
            it('should respond a 201 status code and a new pair tokens', () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode, body } = yield client.post('/api/users/reissue-token').send({ refreshToken });
                expect(statusCode).toBe(201);
                expect(body.data.accessToken).toBeDefined();
                expect(body.data.refreshToken).toBeDefined();
            }));
        });
    });
});
