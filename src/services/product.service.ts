import mongoose, { Callback, DocumentDefinition, FilterQuery, Query, QueryOptions, QueryWithHelpers, UpdateQuery } from 'mongoose';
import { IProduct, ProductModel } from '../models';
import { ResultTypes } from 'ioredis/built/utils/RedisCommander';

export interface IProductService {
    create(product: IProduct): Promise<IProduct>;
    findOne(filter: FilterQuery<IProduct>, options?: QueryOptions): Promise<IProduct | null>;
    findOneAndUpdate(filter: FilterQuery<IProduct>, update: UpdateQuery<IProduct>, options: QueryOptions): Promise<IProduct | null>;
    findOneAndDelete(filter: FilterQuery<IProduct>): Promise<unknown>;
}

type OmitProduct = DocumentDefinition<Omit<IProduct, 'createdAt' | 'updatedAt' | 'productId'>>;

class ProductService implements IProductService {
    async find(filter?: Callback<IProduct[]> | undefined): Promise<IProduct | IProduct[] | {}> {
        return await ProductModel.find(filter);
    }

    async create(product: OmitProduct): Promise<IProduct> {
        return (await ProductModel.create(product)).save();
    }

    async findOne(filter: FilterQuery<IProduct>, options: QueryOptions = { lean: true }): Promise<IProduct | null> {
        return await ProductModel.findOne(filter, {}, options);
    }

    async findOneAndUpdate(filter: FilterQuery<IProduct>, update: UpdateQuery<IProduct>, options: QueryOptions<unknown>): Promise<IProduct | null> {
        return await ProductModel.findOneAndUpdate(filter, update, options);
    }

    async findOneAndDelete(filter: FilterQuery<IProduct>): Promise<unknown> {
        return await ProductModel.findOneAndDelete(filter);
    }
}

export default ProductService;
