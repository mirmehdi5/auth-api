import Redis from 'ioredis';
import config from '../config';
import { logger } from './logger';

export const redisClient = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
    // TODO: Configure TLS properly with CA certificates 
    tls: config.redis.tls ? { rejectUnauthorized: false } : undefined,
    retryStrategy(times: any) {
        const delay = Math.min(times * 50, 2000);
        logger.warn(`Reconnecting to Redis in ${delay}ms...`);
        return delay;
    }
});

redisClient.on('connect', () => {
    logger.info('Connected to Redis');
});

redisClient.on('error', (err: any) => {
    logger.error({
        message: 'Redis error',
        error: err instanceof Error ? err.message : 'Unknown error',
    });
});

export default redisClient;