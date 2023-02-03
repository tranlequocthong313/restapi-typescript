import { config } from 'dotenv';

config();

const getEnvVariable = (key: string): any => {
    const value = process.env[key];
    if (!value && process.env.NODE_ENV === 'production') {
        throw new Error(`ENVIRONMENT VARIABLE '${key}' NOT SPECIFIED.`);
    }
    return value;
};

export default {
    SERVER: {
        PORT: +getEnvVariable('SERVER_PORT') || 3000,
        MORGAN_STYLE: getEnvVariable('SERVER_MORGAN_STYLE') || 'combined',
        NODE_ENV: getEnvVariable('NODE_ENV') || "development",
        RATE_LIMIT_WINDOW: +getEnvVariable('RATE_LIMIT_WINDOW') || 15 * 60 * 1000, // 15 mins
        RATE_LIMIT_MAX: +getEnvVariable('RATE_LIMIT_MAX') || 100
    },
    MONGODB: {
        HOST: getEnvVariable('MONGODB_HOST') || '0.0.0.0',
        PORT: getEnvVariable('MONGODB_PORT') || 27017,
        DB_NAME: getEnvVariable('MONGODB_DB_NAME') || 'test',
        DEBUG: getEnvVariable('MONGODB_DEBUG') || true
    },
    BCRYPT: {
        SALT: +getEnvVariable('BCRYPT_SALT') || 10
    },
    JWT: {
        ACCESS_TOKEN_SECRET: getEnvVariable('JWT_ACCESS_TOKEN_SECRET'),
        REFRESH_TOKEN_SECRET: getEnvVariable('JWT_REFRESH_TOKEN_SECRET'),
        ACCESS_EXPIRES_IN: +getEnvVariable('JWT_ACCESS_EXPIRES_IN') || 15 * 60, // default: 15 mins
        REFRESH_EXPIRES_IN: +getEnvVariable('JWT_REFRESH_EXPIRES_IN') || 24 * 60 * 60, // default: 1 day
    },
};
