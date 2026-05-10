// routes/subject.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const {
  getSubject,
  listSessions,
  listSubjectsBySession,
  correctSubject,
} = require("../controllers/subjectController");

// GET /api/subject/sessions — Lister les sessions
router.get("/sessions", listSessions);

// GET /api/subject/:session — Lister les sujets d'une session
router.get("/:session", listSubjectsBySession);

// GET /api/subject/:session/:chapitre — Récupérer un sujet spécifique
router.get("/:session/:chapitre", getSubject);

// POST /api/subject/correct — Corriger un sujet avec l'IA (protégé)
router.post("/correct", authMiddleware, correctSubject);

module.exports = router;
