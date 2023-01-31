import { Redis } from 'ioredis';
import { logger } from '../utils';

const redis = new Redis(); // localhost

redis.on('connect', () => logger.info('Connected to redis'));
redis.on('error', (err) => logger.error('Redis error:::', err));

export default redis;
