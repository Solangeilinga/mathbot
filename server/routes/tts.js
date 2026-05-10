// routes/tts.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const { synthesize } = require("../controllers/ttsController");

// Rate limit spécifique TTS : 60 req/10min (éviter abus)
const rateLimit = require("express-rate-limit");
const ttsLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 60,
  message: { error: "Trop de requêtes TTS." },
  keyGenerator: (req) => req.user?.id || req.ip,
});

// POST /api/tts — Synthèse vocale (protégé JWT)
router.post("/", authMiddleware, ttsLimiter, synthesize);

module.exports = router;
