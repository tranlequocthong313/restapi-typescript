import { NextFunction, Request, Response } from 'express';
import { IProductService } from '../services';
import { HttpResponse, logger } from '../utils';
import { HttpError } from '../middlewares';

class ProductController {
    constructor(private productService: IProductService) {
        this.productService = productService;
    }

    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            return HttpResponse(res, {
                code: 201,
                message: 'Created successfully',
                data: await this.productService.create({
                    ...req.body,
                    userId: res.locals.payload._id
                })
            });
        } catch (error) {
            logger.error(error);
            next(new HttpError());
        }
    }

    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const updatedProduct = await this.productService.findOneAndUpdate({
                _id: req.params.productId,
                userId: res.locals.payload._id
            },
                req.body,
                { new: true }
            );
            if (!updatedProduct) return next(new HttpError(404, 'Not found'));

            return HttpResponse(res, { code: 200, message: 'Updated successfully', data: updatedProduct });
        } catch (error) {
            logger.error(error);
            next(new HttpError());
        }
    }

    async getProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await this.productService.findOne({ _id: req.params.productId });
            if (!product) return next(new HttpError(404, 'Not found'));

            return HttpResponse(res, { code: 200, message: 'Get successfully', data: product });
        } catch (error) {
            logger.error(error);
            next(new HttpError());
        }
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const deletedProduct = await this.productService.findOneAndDelete({
                _id: req.params.productId,
                userId: res.locals.payload._id
            });
            if (!deletedProduct) return next(new HttpError(404, 'Not found'));

            return HttpResponse(res, { code: 200, message: 'Deleted successfully' });
        } catch (error) {
            logger.error(error);
            next(new HttpError());
        }
    }

}

export default ProductController;
