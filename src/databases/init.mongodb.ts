import mongoose from 'mongoose';
import config from '../../config';
import { logger } from '../utils';

const HOST: string = config.MONGODB.HOST;
const PORT: number = config.MONGODB.PORT;
const DB_NAME: string = config.MONGODB.DB_NAME;
const DEBUG: boolean = config.MONGODB.DEBUG;

const connectToDB = () => {
    mongoose.set('debug', DEBUG);
    mongoose.set('strictQuery', true);

    mongoose.connection.on('connected', () => logger.info(`Connected to mongodb`));
    mongoose.connection.on('error', (error) => logger.error(`Mongodb error:::${error}`));

    mongoose.connect(`mongodb://${HOST}:${PORT}/${DB_NAME}`, { serverSelectionTimeoutMS: 3000 });
};

export default connectToDB;
