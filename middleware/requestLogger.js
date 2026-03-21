const logger = require('../config/logger');

// Request logging middleware - only logs data operations
const requestLogger = (req, res, next) => {
    const startTime = Date.now();

    // Only log POST/PUT/DELETE requests (data operations)
    const shouldLog = ['POST', 'PUT', 'DELETE'].includes(req.method);

    if (shouldLog) {
        // Log incoming data request
        logger.info(`📥 ${req.method} ${req.url}`, {
            method: req.method,
            url: req.url,
            ip: req.ip
        });

        // Log request body
        if (req.body && Object.keys(req.body).length > 0) {
            logger.info('Request Data:', req.body);
        }
    }

    // Capture response for data operations
    const originalSend = res.send;
    res.send = function (data) {
        if (shouldLog) {
            const duration = Date.now() - startTime;

            logger.info(`📤 Response ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);

            // Log response for successful operations
            if (res.statusCode >= 200 && res.statusCode < 300) {
                try {
                    const responseData = JSON.parse(data);
                    logger.info('Response Data:', responseData);
                } catch {
                    // Not JSON, skip
                }
            }

            // Log errors
            if (res.statusCode >= 400) {
                logger.error(`❌ Error ${res.statusCode}:`, data);
            }
        }

        originalSend.call(this, data);
    };

    next();
};

module.exports = requestLogger;
