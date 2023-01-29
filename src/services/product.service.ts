import mongoose, { FilterQuery, QueryOptions, QueryWithHelpers, UpdateQuery } from 'mongoose';
import { IProduct, ProductModel } from '../models';
import { ResultTypes } from 'ioredis/built/utils/RedisCommander';

export interface IProductService {
    create(product: IProduct): Promise<IProduct>;
    findOne(filter: FilterQuery<IProduct>, options?: QueryOptions): Promise<IProduct | null>;
    findOneAndUpdate(filter: FilterQuery<IProduct>, update: UpdateQuery<IProduct>, options: QueryOptions): Promise<IProduct | null>;
    deleteOne(filter: FilterQuery<IProduct>): Promise<unknown>;
}

class ProductService implements IProductService {
    async create(product: IProduct): Promise<IProduct> {
        return (await ProductModel.create(product)).save();
    }

    async findOne(filter: FilterQuery<IProduct>, options: QueryOptions = { lean: true }): Promise<IProduct | null> {
        return await ProductModel.findOne(filter, options);
    }

    async findOneAndUpdate(filter: FilterQuery<IProduct>, update: UpdateQuery<IProduct>, options: QueryOptions<unknown>): Promise<IProduct | null> {
        return await ProductModel.findOneAndUpdate(filter, update, options);
    }

    async deleteOne(filter: FilterQuery<IProduct>): Promise<unknown> {
        return await ProductModel.deleteOne(filter);
    }
}

export default ProductService;
