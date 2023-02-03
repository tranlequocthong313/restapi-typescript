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
        PORT: +getEnvVariable('SERVER_PORT'),
        MORGAN_STYLE: getEnvVariable('SERVER_MORGAN_STYLE'),
        NODE_ENV: getEnvVariable('NODE_ENV') || "development",
        RATE_LIMIT_WINDOW: +getEnvVariable('RATE_LIMIT_WINDOW'),
        RATE_LIMIT_MAX: +getEnvVariable('RATE_LIMIT_MAX')
    },
    MONGODB: {
        HOST: getEnvVariable('MONGODB_HOST'),
        PORT: getEnvVariable('MONGODB_PORT'),
        DB_NAME: getEnvVariable('MONGODB_DB_NAME'),
        DEBUG: getEnvVariable('MONGODB_DEBUG')
    },
    REDIS: {
        HOST: getEnvVariable('REDIS_HOST'),
        PORT: +getEnvVariable('REDIS_PORT')
    },
    BCRYPT: {
        SALT: +getEnvVariable('BCRYPT_SALT')
    },
    JWT: {
        ACCESS_TOKEN_SECRET: getEnvVariable('JWT_ACCESS_TOKEN_SECRET'),
        REFRESH_TOKEN_SECRET: getEnvVariable('JWT_REFRESH_TOKEN_SECRET'),
        ACCESS_EXPIRES_IN: +getEnvVariable('JWT_ACCESS_EXPIRES_IN'),
        REFRESH_EXPIRES_IN: +getEnvVariable('JWT_REFRESH_EXPIRES_IN')
    },
};
