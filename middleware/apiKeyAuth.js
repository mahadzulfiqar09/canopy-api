const ApiError = require("../utils/ApiError");

/**
 * Simple API-key gate for mutating requests (POST / PUT / DELETE).
 * GET requests stay open, matching a public read / protected write model —
 * enough to demonstrate an AuthN checkpoint without requiring a full
 * user/session system for a Project 2 milestone.
 */
function requireApiKey(req, res, next) {
  const expected = process.env.API_KEY;
  const provided = req.header("x-api-key");

  // If no API_KEY is configured on the server, don't lock the developer out.
  if (!expected) return next();

  if (!provided || provided !== expected) {
    return next(ApiError.unauthorized("Missing or invalid x-api-key header."));
  }

  next();
}

module.exports = requireApiKey;
