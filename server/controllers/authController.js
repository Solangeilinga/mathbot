// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { getDB } = require("../db/connection");

const CHAPITRES = ["Probabilités","Géométrie","Algèbre","Fonctions","Statistiques","Trigonométrie"];

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
}

async function register(req, res) {
  const { nom, prenom, email, password } = req.body;
  if (!nom || !prenom || !email || !password) return res.status(400).json({ error: "Tous les champs sont requis." });
  if (password.length < 6) return res.status(400).json({ error: "Mot de passe trop court (min 6 caractères)." });

  const db = getDB();
  try {
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) return res.status(409).json({ error: "Cet email est déjà utilisé." });

    const hash = await bcrypt.hash(password, 12);
    const userId = uuidv4();
    db.prepare("INSERT INTO users (id, nom, prenom, email, password) VALUES (?, ?, ?, ?, ?)").run(userId, nom, prenom, email, hash);

    for (const ch of CHAPITRES) {
      db.prepare("INSERT OR IGNORE INTO progression (id, user_id, chapitre) VALUES (?, ?, ?)").run(uuidv4(), userId, ch);
    }

    const token = signToken({ id: userId, email, nom, prenom });
    res.status(201).json({ message: "Compte créé !", token, user: { id: userId, nom, prenom, email, xp: 0, niveau: 1 } });
  } catch (err) {
    console.error("[register]", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email et mot de passe requis." });

  const db = getDB();
  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) return res.status(401).json({ error: "Email ou mot de passe incorrect." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Email ou mot de passe incorrect." });

    const token = signToken({ id: user.id, email: user.email, nom: user.nom, prenom: user.prenom });
    res.json({ message: "Connexion réussie !", token, user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, xp: user.xp, niveau: user.niveau } });
  } catch (err) {
    console.error("[login]", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
}

function me(req, res) {
  const db = getDB();
  const user = db.prepare("SELECT id, nom, prenom, email, xp, niveau FROM users WHERE id = ?").get(req.user.id);
  if (!user) return res.status(404).json({ error: "Utilisateur introuvable." });
  res.json({ user });
}

module.exports = { register, login, me };
