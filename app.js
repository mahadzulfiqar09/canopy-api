const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const tasksRoutes = require("./routes/tasks.routes");
const healthRoutes = require("./routes/health.routes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

function createApp() {
  const app = express();

  // --- Core middleware ---
  app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
  app.use(express.json({ limit: "10kb" }));
  app.use(morgan(process.env.NODE_ENV === "test" ? "silent" : "dev"));

  // --- Rate limiting: 429 Too Many Requests past the threshold ---
  const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: { status: 429, message: "Too many requests. Please slow down and try again shortly." },
    },
  });
  app.use("/api", limiter);

  // --- Routes ---
  app.get("/", (req, res) => {
    res.status(200).json({
      service: "Canopy API",
      description: "Backend engine for the Canopy task dashboard.",
      docs: "See README.md for the full endpoint reference.",
      health: "/api/health",
    });
  });

  app.use("/api/health", healthRoutes);
  app.use("/api/tasks", tasksRoutes);

  // --- 404 + centralized error handling (must be last) ---
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
