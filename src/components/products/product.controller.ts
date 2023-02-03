import { NextFunction, Request, Response } from 'express';
import { IProductService } from '.';
import { HttpResponse } from '../../utils';
import { HttpError } from '../../middlewares';

class ProductController {
    constructor(private productService: IProductService) {
        this.productService = productService;
    }

    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            HttpResponse(res, {
                code: 201,
                message: 'Created successfully',
                data: await this.productService.create({
                    ...req.body,
                    userId: res.locals.payload._id
                })
            });
        } catch (error: any) {
            next(new HttpError(500, error.message));
        }
    }

    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const updatedProduct = await this.productService.findOneAndUpdate({
                _id: req.params.productId,
                userId: res.locals.payload._id
            }, req.body, { new: true });
            if (!updatedProduct) return next(new HttpError(404, 'Not found'));

            HttpResponse(res, { code: 200, message: 'Updated successfully', data: updatedProduct });
        } catch (error: any) {
            console.error('UPDATE:::', error);
            next(new HttpError(500, error.message));
        }
    }

    getProduct(req: Request, res: Response, next: NextFunction) {
        try {
            this.productService.findOne({ _id: req.params.productId })
                .then(product => HttpResponse(res, {
                    code: 200,
                    message: 'Get successfully',
                    data: product
                }))
                .catch(err => next(new HttpError(404, err.message)));
        } catch (error: any) {
            next(new HttpError(500, error.message));
        }
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const deletedProduct = await this.productService.findOneAndDelete({
                _id: req.params.productId,
                userId: res.locals.payload._id
            });
            if (!deletedProduct) return next(new HttpError(404, 'Not found'));

            HttpResponse(res, { code: 200, message: 'Deleted successfully' });
        } catch (error: any) {
            next(new HttpError(500, error.message));
        }
    }

}

export default ProductController;
