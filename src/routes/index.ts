import { Request, Response, Router } from 'express';
import userRoutes from './user.router';
import productRoutes from './product.router';

const routes = Router();

routes.get('/health-check', (req: Request, res: Response) => res.sendStatus(200));


routes.use('/users', userRoutes);
routes.use('/products', productRoutes);

export default routes;
