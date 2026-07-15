/**
 * ApiError — a lightweight error class that carries an HTTP status code
 * alongside the message, so route handlers can `throw` domain errors and
 * let the central error handler translate them into the right response.
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }

  static badRequest(message, details) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = "Missing or invalid API key.") {
    return new ApiError(401, message);
  }

  static notFound(message = "Resource not found.") {
    return new ApiError(404, message);
  }

  static internal(message = "Something went wrong on our end.") {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;
