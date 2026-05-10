// routes/chat.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const { sendMessage, clearHistory, getHistory } = require("../controllers/chatController");

// Toutes les routes chat sont protégées
router.use(authMiddleware);

// POST /api/chat/message — Envoyer un message à MathBot
router.post("/message", sendMessage);

// GET /api/chat/history/:chapitre — Récupérer l'historique
router.get("/history/:chapitre", getHistory);

// DELETE /api/chat/history/:chapitre — Effacer l'historique
router.delete("/history/:chapitre", clearHistory);

module.exports = router;
