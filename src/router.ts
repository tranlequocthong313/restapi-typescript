import { Router } from 'express';
import { userRouter } from './components/users';
import { productRouter } from './components/products';

const router = Router();

router.use('/users', userRouter);
router.use('/products', productRouter);

export default router;
