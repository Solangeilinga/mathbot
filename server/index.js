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
  console.error(`❌ Variables manquantes : ${missing.join(", ")}`);
  process.exit(1);
}

const app = express();
const isDev = process.env.NODE_ENV !== "production";

// =======================
// SECURITY
// =======================
app.use(helmet());
if (isDev) app.use(morgan("dev"));

// =======================
// CORS (CORRIGÉ)
// =======================

// IMPORTANT : support Netlify + local + ngrok
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL, // Netlify
].filter(Boolean);

// ngrok dynamique (très important !)
app.use(cors({
  origin: function (origin, callback) {
    // allow tools like Postman or server-to-server
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".ngrok-free.dev") ||
      origin.endsWith(".ngrok.io")
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS: " + origin));
  },
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// IMPORTANT pour preflight OPTIONS
app.options("*", cors());

// =======================
// BODY
// =======================
app.use(express.json({ limit: "50kb" }));

// =======================
// RATE LIMITING
// =======================
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 200 : 100,
  message: { error: "Trop de requêtes." },
});

const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: isDev ? 60 : 30,
  message: { error: "Trop de messages." },
});

// =======================
// ROUTES
// =======================
app.use("/api/auth", generalLimiter, require("./routes/auth"));
app.use("/api/chat", chatLimiter, require("./routes/chat"));
app.use("/api/memory", generalLimiter, require("./routes/memory"));
app.use("/api/tts", generalLimiter, require("./routes/tts"));
app.use("/api/progression", generalLimiter, require("./routes/progression"));
app.use("/api/exam", generalLimiter, require("./routes/exam"));
app.use("/api/subject", generalLimiter, require("./routes/subject"));

// =======================
// HEALTH CHECK
// =======================
app.get("/health", (req, res) =>
  res.json({ status: "OK", service: "BEPCMath AI" })
);

// =======================
// 404
// =======================
app.use((req, res) => {
  res.status(404).json({ error: "Route introuvable" });
});

// =======================
// ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);
  res.status(500).json({
    error: isDev ? err.message : "Erreur serveur"
  });
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await initSchema();

    app.listen(PORT, () => {
      console.log("\n🚀 BEPCMath AI démarré");
      console.log("➡️  http://localhost:" + PORT);
      console.log("➡️  Frontend:", process.env.FRONTEND_URL);
    });
  } catch (err) {
    console.error("❌ Erreur démarrage:", err);
    process.exit(1);
  }
})();

module.exports = app;