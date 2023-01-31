import supertest from 'supertest';
import app from '../app';
import { SIGNIN_FAILED_CASE_BODIES, SIGNUP_FAILED_CASE_BODIES, } from './user.test.cases';

const client = supertest(app);

describe('POST /api/users/signin', () => {

    describe('when the email and password is wrong or missing', () => {

        it("should response with a 422 status code", async () => {

            SIGNIN_FAILED_CASE_BODIES.forEach(async body => {

                const response = await client.post('/api/users/signin').send(body);

                expect(response.statusCode).toBe(422);

            });

        });

    });

});

describe('POST /api/users/signup', () => {

    describe('when the email, name, password and password confirmation is wrong or missing', () => {

        it("should response with a 422 status code", async () => {

            SIGNUP_FAILED_CASE_BODIES.forEach(async body => {
                const response = await client.post('/api/users/signup').send(body);

                expect(response.statusCode).toBe(422);
            });

        });

    });

});
