import ProductModel, { IProduct, IProductInput } from './product.model';
import ProductService, { IProductService } from './product.service';
import productSchema from './product.validation';
import ProductController from './product.controller';
import productRouter from './product.router';

export {
    ProductModel,
    IProduct,
    IProductInput,
    ProductService,
    IProductService,
    ProductController,
    productSchema,
    productRouter
};
