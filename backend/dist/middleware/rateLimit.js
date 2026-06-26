import rateLimit from 'express-rate-limit';
export const globalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per IP per minute
    standardHeaders: true,
    legacyHeaders: false,
    validate: false, // Disable all validations for dev
});
export const reportGenerationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000, // 1000 during testing
    keyGenerator: (req) => req.user?.id || 'anonymous',
    message: { error: 'RATE_LIMIT_EXCEEDED', retryAfter: '60 minutes minimum' },
    validate: false,
});
export const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30, // 30 messages per minute per user
    keyGenerator: (req) => req.user?.id || 'anonymous',
    validate: false,
});
//# sourceMappingURL=rateLimit.js.map