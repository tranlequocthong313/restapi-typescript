import { Redis } from 'ioredis';
import { logger } from '../utils';
import config from '../../config';

const redis = new Redis(config.REDIS.PORT, config.REDIS.HOST);

redis.on('connect', () => logger.info('Connected to redis'));
redis.on('error', (err) => logger.error(`Redis error:::${err}`));

export default redis;
