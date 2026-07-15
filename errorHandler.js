const ApiError = require("../utils/ApiError");

/**
 * Catches any request that didn't match a route and turns it into a
 * consistent 404 ApiError, so it flows through the same error handler
 * as every other failure.
 */
function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`No route matches ${req.method} ${req.originalUrl}.`));
}

/**
 * The server's tone, in one place. Every error — validation, auth, missing
 * resource, or an unexpected bug — resolves here into a predictable
 * { error: { message, details } } JSON body and the right status code,
 * so clients never have to guess.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) {
    console.error(`[${new Date().toISOString()}]`, err);
  }

  res.status(statusCode).json({
    error: {
      status: statusCode,
      message: isServerError ? "Something went wrong on our end." : err.message,
      details: err.details || undefined,
    },
  });
}

module.exports = { notFoundHandler, errorHandler };
