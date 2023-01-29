import { NextFunction, Request, Response } from 'express';
import { IProductService } from '../services';
import { HttpResponse, logger } from '../utils';
import { HttpError } from '../middlewares';
import { redis } from '../databases';
import { IProduct } from '../models';

class ProductController {
    constructor(private productService: IProductService) {
        this.productService = productService;
    }

    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await this.productService.create({ ...req.body, userId: res.locals.payload._id });
            await this.cacheProduct(product);
            return new HttpResponse(res, { code: 201, message: 'Created successfully', data: product });
        } catch (error) {
            logger.error(error);
            next(new HttpError());
        }
    }

    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = res.locals.payload._id;
            const { productId } = req.params;

            const updatedProduct = await this.productService.findOneAndUpdate({ _id: productId, userId }, req.body, { new: true });
            if (!updatedProduct) return next(new HttpError());

            await this.cacheProduct(updatedProduct);
            return new HttpResponse(res, { code: 200, message: 'Updated successfully', data: updatedProduct });
        } catch (error) {
            logger.error(error);
            next(new HttpError());
        }
    }

    async getProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { productId } = req.params;
            const cachedProduct = await redis.get(`product:::${productId}`);
            if (cachedProduct)
                return new HttpResponse(res, { code: 200, message: 'Success', data: JSON.parse(cachedProduct) });

            const product = await this.productService.findOne({ _id: productId });
            if (!product) return next(new HttpError(404, 'Not found product'));

            await this.cacheProduct(product);
            return new HttpResponse(res, { code: 200, message: 'Success', data: product });
        } catch (error) {
            logger.error(error);
            next(new HttpError());
        }
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = res.locals.payload._id;
            const { productId } = req.params;

            const deletedProduct = await this.productService.deleteOne({ _id: productId, userId });
            if (!deletedProduct) return next(new HttpError());

            await redis.del(`product:::${productId}`);
            return new HttpResponse(res, { code: 200, message: 'Deleted successfully' });
        } catch (error) {
            logger.error(error);
            next(new HttpError());
        }
    }

    private async cacheProduct(product: IProduct) {
        const timeToLive = 24 * 60 * 60; // 24 hours
        await redis.set(`product:::${product?._id}`, JSON.stringify(product), 'EX', timeToLive);
    }
}

export default ProductController;
