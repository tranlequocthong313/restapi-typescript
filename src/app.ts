import express from 'express';
import routes from './routes';
import helmet from 'helmet';
import morgan from 'morgan';
import config from '../config';
import { notFound, responseErrors } from './middlewares';
import compression from 'compression';

const app = express();

app
    .use(express.json())
    .use(helmet())
    .use(compression())
    .use(morgan(config.SERVER.MORGAN_STYLE))

    .use('/api', routes)

    .use(notFound)
    .use(responseErrors);


export default app;
