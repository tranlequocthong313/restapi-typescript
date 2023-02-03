import { productSchema, ProductController, ProductService } from '.';
import { authorize, validate } from '../../middlewares';
import { Router } from 'express';

const productRouter = Router();

const productService = new ProductService();
const productController = new ProductController(productService);

productRouter.get('/:productId', productController.getProduct.bind(productController));

// Authorize from here
productRouter.use(authorize);

productRouter.delete('/:productId', productController.deleteProduct.bind(productController));

// Validate user's input from here
productRouter.use(validate(productSchema));
productRouter.post('', productController.createProduct.bind(productController));
productRouter.put('/:productId', productController.updateProduct.bind(productController));

export default productRouter;
