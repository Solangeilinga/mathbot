// middlewares/auth.js — Vérification JWT sur les routes protégées
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  // Désactiver l’auth en développement
  const isDev = process.env.NODE_ENV !== "production";
  if (isDev) {
    // Injecter un utilisateur factice sans vérifier le token
    req.user = {
      id: "dev-user-id",
      email: "dev@example.com",
      nom: "Développeur",
      prenom: "Test"
    };
    return next();
  }

  // Mode production : vérification réelle du token
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant ou invalide." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, nom, prenom }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expirée, reconnecte-toi." });
    }
    return res.status(401).json({ error: "Token invalide." });
  }
}

module.exports = authMiddleware;