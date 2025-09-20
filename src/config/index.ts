import { StringValue } from "ms";

interface Config {
    port: number;
    redis: {
        host: string;
        port: number;
        password?: string;
        tls?: boolean;
    };
    jwtSecret: string;
    jwtExpiration: StringValue;
}

const config: Config = {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
        password: process.env.REDIS_PASSWORD || '',
        tls: process.env.REDIS_TLS === 'true' || false,
    },
    jwtSecret: process.env.JWT_SECRET || '7f9a3b2c8e6d4f1a9b0c3e7d2f5a6b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
    jwtExpiration: (process.env.JWT_EXPIRATION || '1H') as StringValue,
};

export default config;