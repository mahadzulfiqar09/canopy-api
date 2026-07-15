const { BEDS } = require("../data/store");
const ApiError = require("../utils/ApiError");

/**
 * The Gatekeeper Rule: never trust the client. Every write request is
 * checked for shape (syntactic validation) before it ever reaches the
 * in-memory store.
 */
function validateCreate(req, res, next) {
  const { title, bed } = req.body || {};
  const errors = [];

  if (typeof title !== "string" || title.trim().length === 0) {
    errors.push("`title` is required and must be a non-empty string.");
  } else if (title.trim().length > 140) {
    errors.push("`title` must be 140 characters or fewer.");
  }

  if (bed !== undefined && !BEDS.includes(bed)) {
    errors.push(`\`bed\` must be one of: ${BEDS.join(", ")}.`);
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest("Validation failed.", errors));
  }

  req.body.title = title.trim();
  req.body.bed = bed || BEDS[0];
  next();
}

function validateUpdate(req, res, next) {
  const { title, bed, done } = req.body || {};
  const errors = [];

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      errors.push("`title`, if provided, must be a non-empty string.");
    } else if (title.trim().length > 140) {
      errors.push("`title` must be 140 characters or fewer.");
    }
  }

  if (bed !== undefined && !BEDS.includes(bed)) {
    errors.push(`\`bed\` must be one of: ${BEDS.join(", ")}.`);
  }

  if (done !== undefined && typeof done !== "boolean") {
    errors.push("`done`, if provided, must be a boolean.");
  }

  if (Object.keys(req.body || {}).length === 0) {
    errors.push("Request body must include at least one field to update.");
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest("Validation failed.", errors));
  }

  if (title !== undefined) req.body.title = title.trim();
  next();
}

module.exports = { validateCreate, validateUpdate };
