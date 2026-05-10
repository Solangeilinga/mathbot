// routes/progression.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const {
  getProgression,
  logExercice,
  logSession,
  leaderboard,
} = require("../controllers/progressionController");

// Toutes les routes progression sont protégées sauf leaderboard
router.use(authMiddleware);

// GET /api/progression — Progression complète de l'élève
router.get("/", getProgression);

// POST /api/progression/exercice — Enregistrer résultat d'un exercice
router.post("/exercice", logExercice);

// POST /api/progression/session — Enregistrer une session terminée
router.post("/session", logSession);

// GET /api/progression/leaderboard — Top 10 élèves
router.get("/leaderboard", leaderboard);

module.exports = router;
