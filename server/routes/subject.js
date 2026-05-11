// routes/subject.js
const express = require("express");
const router  = express.Router();
const authMiddleware = require("../middlewares/auth");
const {
  getSubject,
  listSessions,
  listSubjectsBySession,
  correctSubject,
} = require("../controllers/subjectController");

// GET /api/subject/sessions
router.get("/sessions", listSessions);

// POST /api/subject/correct
router.post("/correct", authMiddleware, correctSubject);

// GET /api/subject/:session/:chapitre  ← AVANT /:session obligatoirement
router.get("/:session/:chapitre", authMiddleware, (req, res, next) => {
  console.log(`[subject] GET session="${req.params.session}" chapitre="${req.params.chapitre}"`);
  next();
}, getSubject);

// GET /api/subject/:session
router.get("/:session", (req, res, next) => {
  console.log(`[subject] GET session="${req.params.session}" (liste)`);
  next();
}, listSubjectsBySession);

module.exports = router;