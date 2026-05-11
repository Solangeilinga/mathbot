// routes/exercise.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const { analyzeExercise } = require("../controllers/exerciseController");

// POST /api/exercise/analyze — Analyser un exercice (image ou texte)
router.post("/analyze", authMiddleware, analyzeExercise);

module.exports = router;