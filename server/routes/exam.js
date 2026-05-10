// routes/exam.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const { logExamResults, getExamHistory, getExamStats } = require("../controllers/examController");

// Toutes les routes d'examen sont protégées
router.use(authMiddleware);

// POST /api/exam/results — Enregistrer les résultats d'un examen
router.post("/results", logExamResults);

// GET /api/exam/history — Récupérer l'historique des examens
router.get("/history", getExamHistory);

// GET /api/exam/history/:chapitre — Récupérer l'historique d'un chapitre spécifique
router.get("/history/:chapitre", getExamHistory);

// GET /api/exam/stats/:chapitre — Récupérer les stats d'un chapitre
router.get("/stats/:chapitre", getExamStats);

module.exports = router;
