// index.js — Serveur Express BEPCMath AI (version corrigée)
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { init: initSchema } = require("./db/init");

// Vérification stricte des variables d'environnement
const requiredEnv = ["GEMINI_API_KEY", "JWT_SECRET", "DB_HOST", "DB_USER", "DB_NAME"];
const missing = requiredEnv.filter(key => !process.env[key]);
if (missing.length) {
  console.error(`❌ Variables d'environnement manquantes : ${missing.join(", ")}`);
  process.exit(1);
}

// Vérification optionnelle de la base (mot de passe peut être vide)
if (process.env.DB_PASSWORD === undefined) {
  console.warn("⚠️  DB_PASSWORD non définie, utilisation d'un mot de passe vide.");
}

const app = express();
const isDev = process.env.NODE_ENV !== "production";

// Sécurité et logs
app.use(helmet());
if (isDev) app.use(morgan("dev"));

// CORS
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(cors({
  origin: frontendUrl,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json({ limit: "50kb" }));

// Rate limiting plus souple en développement (mais actif)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 200 : 100,
  message: { error: "Trop de requêtes." },
});

const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: isDev ? 60 : 30,
  message: { error: "Trop de messages. Pause 10 min." },
  keyGenerator: (req) => req.user?.id || req.ip,
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: isDev ? 20 : 10,
  message: { error: "Trop de tentatives de connexion." },
});

// Routes (l'authentification est réelle – plus de fake login)
app.use("/api/auth", authLimiter, generalLimiter, require("./routes/auth"));
app.use("/api/chat", chatLimiter, require("./routes/chat"));
app.use("/api/memory", generalLimiter, require("./routes/memory"));
app.use("/api/tts", generalLimiter, require("./routes/tts"));
app.use("/api/progression", generalLimiter, require("./routes/progression"));
app.use("/api/exam", generalLimiter, require("./routes/exam"));
app.use("/api/subject", generalLimiter, require("./routes/subject"));

// Santé
app.get("/health", (req, res) => res.json({ status: "OK", service: "BEPCMath AI" }));

// Gestion 404
app.use((req, res) =>
  res.status(404).json({ error: `Route ${req.method} ${req.path} introuvable.` })
);

// Gestion globale des erreurs (avec logs détaillés)
app.use((err, req, res, next) => {
  console.error(`[ERROR ${new Date().toISOString()}]`, err.message);
  if (err.stack) console.error(err.stack);
  const status = err.status || 500;
  const message = status === 500 && !isDev
    ? "Erreur interne du serveur."
    : err.message;
  res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 4000;

// Démarrage asynchrone avec timeout pour les opérations longues
(async () => {
  try {
    // Init des tables MySQL avec timeout
    await Promise.race([
      initSchema(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout initDB (30s)")), 30000))
    ]);
    const server = app.listen(PORT, () => {
      console.log(`\n🦉 MathBot — Serveur démarré`);
      console.log(`   ➜  http://localhost:${PORT}`);
      console.log(`   ➜  Frontend : ${frontendUrl}`);
      console.log(`   ➜  Environnement : ${isDev ? "DÉVELOPPEMENT" : "PRODUCTION"}\n`);
    });

    // Timeout global pour les réponses lentes (60 secondes)
    server.timeout = 60000;
  } catch (err) {
    console.error("❌ Erreur de démarrage :", err);
    process.exit(1);
  }
})();

module.exports = app;