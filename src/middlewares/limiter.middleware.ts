import rateLimit from 'express-rate-limit';
import config from '../../config';

const apiLimiter = rateLimit({
    windowMs: config.SERVER.RATE_LIMIT_WINDOW, // 15 minutes
    max: config.SERVER.RATE_LIMIT_MAX,
    standardHeaders: false,
    legacyHeaders: false,
});

export default apiLimiter;
