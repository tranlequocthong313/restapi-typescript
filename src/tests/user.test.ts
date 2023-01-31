import supertest, { SuperTest, Test } from 'supertest';
import app from '../app';
import { SIGNIN_FAILED_CASE_BODIES, SIGNUP_FAILED_CASE_BODIES, } from './user.test.cases';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { IUser, UserModel } from '../models';
import { IUserService, UserService } from '../services';

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

let client: SuperTest<Test>;
let user: IUser;
let userService: IUserService;

describe('user tests', () => {

    beforeAll(async () => {

        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

        client = supertest(app);
        userService = new UserService();
        user = await userService.createUser(userPayload);

    });

    afterAll(() => Promise.all([

        mongoose.disconnect(),
        mongoose.connection.close(),

    ]));

    describe('POST /api/users/signin', () => {

        describe('given an invalid or missing email and password', () => {

            it("should response with a 422 status code", async () => {

                SIGNIN_FAILED_CASE_BODIES.forEach(async body => {

                    const response = await client.post('/api/users/signin').send(body);

                    expect(response.statusCode).toBe(422);

                });

            });

        });

        describe('given a wrong email or password', () => {

            it("should respond with a 403 status code", async () => {

                const { statusCode } = await client.post('/api/users/signin').send(nonExistUserPayload);

                expect(statusCode).toBe(403);

            });

        });

        describe('given a correct email and password', () => {

            it('should respond with a 200 status code and user data', async () => {

                const { statusCode, body } = await client.post('/api/users/signin').send(userAuth);

                expect(statusCode).toBe(200);
                expect(body.data.email).toBe(user.email);
                expect(body.data.name).toBe(user.name);

            });

        });

    });

    describe('POST /api/users/signup', () => {

        describe('given an invalid or missing data body', () => {

            it("should respond with a 422 status code", async () => {

                SIGNUP_FAILED_CASE_BODIES.forEach(async body => {
                    const response = await client.post('/api/users/signup').send(body);

                    expect(response.statusCode).toBe(422);
                });

            });

        });

        describe('given a correct data body', () => {

            it('should respond with a 201 status code and new user data', async () => {

                const userPayload = {
                    name: 'testuser',
                    email: 'test@gmail.com',
                    password: 'password',
                    passwordConfirmation: 'password'
                };

                const { statusCode, body } = await client.post('/api/users/signup')
                    .send(userPayload);

                expect(statusCode).toBe(201);
                expect(body.data.name).toBe(userPayload.name);
                expect(body.data.email).toBe(userPayload.email);

            });

        });

        describe('given a user has already existed', () => {

            it('should respond with a 409 status code', async () => {

                const { statusCode } = await client.post('/api/users/signup').send(userPayload);

                expect(statusCode).toBe(409);

            });

        });

    });

    describe('UserModel', () => {

        describe('given a plain password', () => {

            it('should respond with a hash password', async () => {

                const userPayload = {
                    name: 'testusermodel',
                    email: 'testusermodel@gmail.com',
                    password: 'password',
                    passwordConfirmation: 'password'
                };

                const user = await (new UserModel(userPayload)).save();

                expect(user.password).not.toBe(userPayload.password);

            });

        });

    });

});
