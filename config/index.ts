export default {
    SERVER: {
        PORT: 3000,
        MORGAN_STYLE: 'dev'
    },
    MONGODB: {
        HOST: '0.0.0.0',
        PORT: 27017,
        DB_NAME: 'restapi-typescript',
        DEBUG: true
    },
    BCRYPT: {
        SALT: 10
    },
    JWT: {
        ACCESS_TOKEN_SECRET: 'thKfiFYOMwNC8gd2UzQAa3X0vmRuBrqZ',
        REFRESH_TOKEN_SECRET: 'PtDv8cpCE1awoBnkMieRmUYJK6LAhHuq',
        ACCESS_EXPIRES_IN: 24 * 60 * 60,
        REFRESH_EXPIRES_IN: 365 * 24 * 60 * 60,
    },
};
