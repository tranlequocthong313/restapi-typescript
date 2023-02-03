"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const getEnvVariable = (key) => {
    const value = process.env[key];
    if (!value && process.env.NODE_ENV === 'production') {
        throw new Error(`ENVIRONMENT VARIABLE '${key}' NOT SPECIFIED.`);
    }
    return value;
};
exports.default = {
    SERVER: {
        PORT: +getEnvVariable('SERVER_PORT') || 3000,
        MORGAN_STYLE: getEnvVariable('SERVER_MORGAN_STYLE') || 'combined',
        NODE_ENV: getEnvVariable('NODE_ENV') || "development",
        RATE_LIMIT_WINDOW: +getEnvVariable('RATE_LIMIT_WINDOW') || 15 * 60 * 1000,
        RATE_LIMIT_MAX: +getEnvVariable('RATE_LIMIT_MAX') || 100
    },
    MONGODB: {
        HOST: getEnvVariable('MONGODB_HOST') || '0.0.0.0',
        PORT: getEnvVariable('MONGODB_PORT') || 27017,
        DB_NAME: getEnvVariable('MONGODB_DB_NAME') || 'test',
        DEBUG: getEnvVariable('MONGODB_DEBUG') || true
    },
    REDIS: {
        HOST: getEnvVariable('REDIS_HOST') || '127.0.0.1',
        PORT: +getEnvVariable('REDIS_PORT') || 6379
    },
    BCRYPT: {
        SALT: +getEnvVariable('BCRYPT_SALT') || 10
    },
    JWT: {
        ACCESS_TOKEN_SECRET: getEnvVariable('JWT_ACCESS_TOKEN_SECRET'),
        REFRESH_TOKEN_SECRET: getEnvVariable('JWT_REFRESH_TOKEN_SECRET'),
        ACCESS_EXPIRES_IN: +getEnvVariable('JWT_ACCESS_EXPIRES_IN') || 15 * 60,
        REFRESH_EXPIRES_IN: +getEnvVariable('JWT_REFRESH_EXPIRES_IN') || 24 * 60 * 60, // default: 1 day
    },
};
