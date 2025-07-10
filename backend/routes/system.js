import express from "express";
import emailScheduler from "../services/emailScheduler.js";

const router = express.Router();

/**
 * Health check endpoint
 * Returns system status and basic information
 */
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "CMS API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    emailScheduler: emailScheduler.getStatus(),
  });
});

/**
 * Test session endpoint
 * Useful for debugging session functionality
 */
router.get("/test-session", (req, res) => {
  if (!req.session.views) {
    req.session.views = 0;
  }
  req.session.views++;

  res.json({
    message: "Session test",
    sessionId: req.sessionID,
    views: req.session.views,
    userData: req.session.userData || null,
  });
});

/**
 * System information endpoint
 * Returns basic system information (development only)
 */
router.get("/info", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "Not available in production" });
  }

  res.json({
    nodeVersion: process.version,
    platform: process.platform,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
    emailSchedulerStatus: emailScheduler.getStatus(),
  });
});

export default router;
