// routes/auth.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const { register, login, me } = require("../controllers/authController");

// POST /api/auth/register — Créer un compte élève
router.post("/register", register);

// POST /api/auth/login — Se connecter
router.post("/login", login);

// GET /api/auth/me — Profil de l'élève connecté (protégé)
router.get("/me", authMiddleware, me);

module.exports = router;
