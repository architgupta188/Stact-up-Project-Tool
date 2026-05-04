import rateLimit from 'express-rate-limit';
export const globalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per IP per minute
    standardHeaders: true,
    legacyHeaders: false,
});
export const reportGenerationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 report generations per user per hour
    keyGenerator: (req) => req.user?.id ?? req.ip,
    message: { error: 'RATE_LIMIT_EXCEEDED', retryAfter: '60 minutes minimum' }
});
export const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30, // 30 messages per minute per user
    keyGenerator: (req) => req.user?.id ?? req.ip,
});
//# sourceMappingURL=rateLimit.js.map