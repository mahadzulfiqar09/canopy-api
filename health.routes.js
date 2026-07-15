const express = require("express");
const router = express.Router();

/**
 * GET /api/health
 * A minimal liveness check — the first endpoint any deploy or uptime
 * monitor should be able to call.
 */
router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "canopy-api",
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
