// routes/memory.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const { getMemory, updateMemory } = require("../controllers/memoryController");

router.use(authMiddleware);

// GET  /api/memory         — récupérer le profil pédagogique
router.get("/", getMemory);

// POST /api/memory/update  — mettre à jour le profil après une session
router.post("/update", updateMemory);

module.exports = router;
