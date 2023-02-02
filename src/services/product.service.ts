import { Callback, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { IProduct, IProductInput, ProductModel } from '../models';
import { redis } from '../databases';

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
        const createdProduct = await (await ProductModel.create(product)).save();
        await this.cacheProduct(createdProduct);
        return createdProduct;
    }

    async findOne(filter: FilterQuery<IProduct>, options: QueryOptions<IProduct> = { lean: true }): Promise<IProduct | null> {
        const cachedProduct = await this.getCachedProduct(filter._id);
        if (cachedProduct) return JSON.parse(cachedProduct);

        const product = await ProductModel.findOne(filter, {}, options);
        product && await this.cacheProduct(product);

        return product;
    }

    async findOneAndUpdate(filter: FilterQuery<IProduct>, update: UpdateQuery<IProduct>, options: QueryOptions<IProduct>): Promise<IProduct | null> {
        const updatedProduct = await ProductModel.findOneAndUpdate(filter, update, options);
        updatedProduct && await this.cacheProduct(updatedProduct);
        return updatedProduct;
    }

    async findOneAndDelete(filter: FilterQuery<IProduct>, options?: QueryOptions<IProduct>): Promise<unknown> {
        const deletedProduct = await ProductModel.findOneAndDelete(filter, options);
        await this.deleteCachedProduct(filter._id);
        return deletedProduct;
    }

    private async cacheProduct(product: IProduct) {
        const timeToLive = 24 * 60 * 60; // 24 hours
        await redis.set(this.baseFormat(product._id), JSON.stringify(product), 'EX', timeToLive);
    }

    private async getCachedProduct(productId: string) {
        return await redis.get(this.baseFormat(productId));
    }

    private async deleteCachedProduct(productId: string) {
        return await redis.del(this.baseFormat(productId));
    }

    private baseFormat(productId: string): string {
        return `product:::${productId}`;
    }
}

export default ProductService;
