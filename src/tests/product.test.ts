import supertest, { SuperTest, Test } from 'supertest';
import app from '../app';
import mongoose, { Types } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ProductService } from '../services';
import { jwt } from '../utils';
import config from '../../config';
import { FAILED_CASE_BODIES } from './product.test.cases';
import { IProduct } from '../models';


const productPayload = {
    title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
    description: "Designed for first-time DSLR owners who want impressive results straight out of the box,\
    Designed for first - time DSLR owners who want impressive results straight out of the box",
    price: 879.99,
    image: "https://i.imgur.com/QlRphfQ.jpg",
};

const notExistProductId = '63d6460a95d7c852b8be9d58';

let client: SuperTest<Test>;
let product: IProduct;
let userId: string;
let accessToken: string;
let productService: ProductService;

describe('product tests', () => {

    beforeAll(async () => {

        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

        client = supertest(app);

    });

    afterAll(() => Promise.all([

        mongoose.disconnect(),
        mongoose.connection.close(),

    ]));

    beforeEach(async () => {

        userId = new Types.ObjectId().toString();
        accessToken = jwt.signToken({ _id: userId }, config.JWT.ACCESS_TOKEN_SECRET);
        productService = new ProductService();
        product = await productService.create({ ...productPayload, userId });

    });

    describe('GET /api/products/:id', () => {

        describe('given a product id does not exist', () => {

            it("should respond with a 404 status code", async () => {

                const response = await client.get(`/api/products/${notExistProductId}`);

                expect(response.statusCode).toBe(404);

            });

        });

        describe('given a product id does exist', () => {

            it("should response with a 200 status code and the product", async () => {

                const { body, statusCode } = await client.get(`/api/products/${product._id.toString()}`);

                expect(statusCode).toBe(200);
                expect(body.data.productId).toEqual(product.productId);
                expect(body.data.description).toEqual(product.description);
                expect(body.data.image).toEqual(product.image);
                expect(body.data.price).toEqual(product.price);
                expect(body.data.userId).toEqual(product.userId.toString());

            });

        });

    });

    describe('POST /api/products', () => {

        describe('given a user is not logged in', () => {

            it('should return a 401', async () => {

                const { statusCode } = await client.post("/api/products");

                expect(statusCode).toBe(401);

            });

        });

        describe('given a user is logged in', () => {

            it('should return a 201 status code and a new product', async () => {

                const { body, statusCode } = await client.post('/api/products')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send(productPayload);

                expect(statusCode).toBe(201);
                expect(body.data.description).toEqual(productPayload.description);
                expect(body.data.image).toEqual(productPayload.image);
                expect(body.data.price).toEqual(productPayload.price);
                expect(body.data.userId).toEqual(userId.toString());

            });

        });

        describe('given invalid or missing data bodies', () => {

            it('should return a 422 status code', () => {

                FAILED_CASE_BODIES.forEach(async body => {
                    const { statusCode } = await client.post('/api/products')
                        .set('Authorization', `Bearer ${accessToken}`)
                        .send(body);

                    expect(statusCode).toBe(422);
                });

            });

        });

    });

    describe('PUT /api/products/:id', () => {

        describe('given a product id does not exist', () => {

            it('should respond a 404 status code', async () => {

                const { statusCode } = await client.put(`/api/products/${notExistProductId}`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send(productPayload);

                expect(statusCode).toBe(404);

            });

        });

        describe('given a user is not logged in', () => {

            it('should respond a 401', async () => {

                const { statusCode } = await client.put(`/api/products/${product._id.toString()}`);

                expect(statusCode).toBe(401);

            });

        });

        describe('given a user is logged in', () => {

            it('should respond a 200 status code and a updated product', async () => {

                const updateProductPayload = {
                    title: "Macbook Pro 2023",
                    description: "Designed for first-time DSLR owners who want impressive results straight out of the box,\
                    Designed for first - time DSLR owners who want impressive results straight out of the box",
                    price: 1499,
                    image: "https://i.imgur.com/QlRphfQ.jpg",
                };

                const { body, statusCode } = await client.put(`/api/products/${product._id.toString()}`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send(updateProductPayload);

                expect(statusCode).toBe(200);
                expect(body.data.description).toEqual(updateProductPayload.description);
                expect(body.data.image).toEqual(updateProductPayload.image);
                expect(body.data.price).toEqual(updateProductPayload.price);
                expect(body.data.userId).toEqual(userId.toString());

            });

        });

        describe('given invalid or missing data bodies', () => {

            it('should respond a 422 status code', () => {

                FAILED_CASE_BODIES.forEach(async body => {
                    const { statusCode } = await client.put(`/api/products/${product._id.toString()}`)
                        .set('Authorization', `Bearer ${accessToken}`)
                        .send(body);

                    expect(statusCode).toBe(422);
                });

            });

        });

    });

    describe('DELETE /api/products/:id', () => {

        describe('give a product id does not exist', () => {

            it('should respond a 404 status code', async () => {

                const { statusCode } = await client.delete(`/api/products/${notExistProductId}`)
                    .set('Authorization', `Bearer ${accessToken}`);

                expect(statusCode).toBe(404);

            });

        });

        describe('given a user is not logged in', () => {

            it('should respond a 401 status code', async () => {

                const { statusCode } = await client.delete(`/api/products/${product._id.toString()}`);

                expect(statusCode).toBe(401);

            });

        });

        describe('given a user is logged in', () => {

            it('should respond a 200 status code', async () => {

                const { statusCode } = await client.delete(`/api/products/${product._id.toString()}`)
                    .set('Authorization', `Bearer ${accessToken}`);

                expect(statusCode).toBe(200);

            });

        });

    });

});
