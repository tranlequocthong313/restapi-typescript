import { Callback, DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { IProduct, IProductInput, ProductModel } from '../models';

export interface IProductService {
    create(product: IProductInput): Promise<IProduct>;
    findOne(filter: FilterQuery<IProduct>, options?: QueryOptions<IProduct>): Promise<IProduct | null>;
    findOneAndUpdate(filter: FilterQuery<IProduct>, update: UpdateQuery<IProduct>, options: QueryOptions<IProduct>): Promise<IProduct | null>;
    findOneAndDelete(filter: FilterQuery<IProduct>): Promise<unknown>;
}

class ProductService implements IProductService {
    async find(filter?: Callback<IProduct[]> | undefined): Promise<IProduct | IProduct[] | {}> {
        return await ProductModel.find(filter);
    }

    async create(product: IProductInput): Promise<IProduct> {
        return (await ProductModel.create(product)).save();
    }

    async findOne(filter: FilterQuery<IProduct>, options: QueryOptions<IProduct> = { lean: true }): Promise<IProduct | null> {
        return await ProductModel.findOne(filter, {}, options);
    }

    async findOneAndUpdate(filter: FilterQuery<IProduct>, update: UpdateQuery<IProduct>, options: QueryOptions<IProduct>): Promise<IProduct | null> {
        return await ProductModel.findOneAndUpdate(filter, update, options);
    }

    async findOneAndDelete(filter: FilterQuery<IProduct>, options?: QueryOptions<IProduct>): Promise<unknown> {
        return await ProductModel.findOneAndDelete(filter, options);
    }
}

export default ProductService;
