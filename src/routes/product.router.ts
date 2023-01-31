import { ProductController } from '../controllers';
import { authorize, validate } from '../middlewares';
import { ProductModel } from '../models';
import { ProductService } from '../services';
import { HttpResponse } from '../utils';
import { productSchema } from '../validations';
import { Router } from 'express';

const routes = Router();

const productService = new ProductService();
const productController = new ProductController(productService);

routes.get('/:productId', productController.getProduct.bind(productController));

// Authorize from here
routes.use(authorize);

routes.delete('/:productId', productController.deleteProduct.bind(productController));

// Validate user's input from here
routes.use(validate(productSchema));
routes.post('', productController.createProduct.bind(productController));
routes.put('/:productId', productController.updateProduct.bind(productController));

export default routes;
