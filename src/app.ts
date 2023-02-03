import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import config from '../config';
import { apiLimiter, notFound, responseErrors } from './middlewares';
import compression from 'compression';
import router from './router';

const app = express();

app
    .enable('trust proxy')

    .use(helmet())
    .use(apiLimiter)
    .use(express.json())
    .use(compression())
    .use(morgan(config.SERVER.MORGAN_STYLE))

    .use('/api', router)

    .use(notFound)
    .use(responseErrors);

export default app;
