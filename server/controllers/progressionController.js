// controllers/progressionController.js
const { v4: uuidv4 } = require("uuid");
const { getDB } = require("../db/connection");

function getProgression(req, res) {
  const db = getDB();
  const userId = req.user.id;
  const user = db.prepare("SELECT xp, niveau FROM users WHERE id = ?").get(userId);
  const chapitres = db.prepare("SELECT chapitre, score, sessions, exercices, reussites FROM progression WHERE user_id = ?").all(userId);
  const stats = db.prepare("SELECT COUNT(*) as total_sessions, SUM(xp_gagne) as total_xp FROM sessions WHERE user_id = ?").get(userId);
  res.json({ xp: user?.xp ?? 0, niveau: user?.niveau ?? 1, chapitres, stats });
}

function logExercice(req, res) {
  const { chapitre, correct } = req.body;
  const userId = req.user.id;
  if (!chapitre || correct === undefined) return res.status(400).json({ error: "chapitre et correct requis." });

  const db = getDB();
  const xpGagne = correct ? 20 : 5;

  // Log exercice
  db.prepare("INSERT INTO exercices_log (user_id, chapitre, correct, xp_gagne) VALUES (?, ?, ?, ?)").run(userId, chapitre, correct ? 1 : 0, xpGagne);

  // Récupérer état actuel
  const prog = db.prepare("SELECT exercices, reussites FROM progression WHERE user_id = ? AND chapitre = ?").get(userId, chapitre);
  const newExercices = (prog?.exercices || 0) + 1;
  const newReussites = (prog?.reussites || 0) + (correct ? 1 : 0);
  const newScore = Math.round(newReussites * 100 / newExercices);

  // ✅ Correction 1 : datetime('now') → NOW()
  db.prepare("UPDATE progression SET exercices = ?, reussites = ?, score = ?, updated_at = NOW() WHERE user_id = ? AND chapitre = ?").run(newExercices, newReussites, newScore, userId, chapitre);

  // Mise à jour XP
  const currentUser = db.prepare("SELECT xp FROM users WHERE id = ?").get(userId);
  const newXP = (currentUser?.xp || 0) + xpGagne;
  const newNiveau = Math.max(1, Math.floor(newXP / 100) + 1);
  // ✅ Correction 2 : datetime('now') → NOW()
  db.prepare("UPDATE users SET xp = ?, niveau = ?, updated_at = NOW() WHERE id = ?").run(newXP, newNiveau, userId);

  res.json({ xpGagne, xp: newXP, niveau: newNiveau, message: correct ? "Bonne réponse ! +20 XP 🎉" : "Bonne tentative ! +5 XP 💪" });
}

function logSession(req, res) {
  const { chapitre, xpGagne, dureeSec } = req.body;
  const userId = req.user.id;
  if (!chapitre) return res.status(400).json({ error: "chapitre requis." });
  const db = getDB();
  db.prepare("INSERT INTO sessions (id, user_id, chapitre, xp_gagne, duree_sec) VALUES (?, ?, ?, ?, ?)").run(uuidv4(), userId, chapitre, xpGagne || 0, dureeSec || 0);
  db.prepare("UPDATE progression SET sessions = sessions + 1 WHERE user_id = ? AND chapitre = ?").run(userId, chapitre);
  res.status(201).json({ message: "Session enregistrée." });
}

function leaderboard(req, res) {
  const db = getDB();
  const top = db.prepare("SELECT prenom, nom, xp, niveau FROM users ORDER BY xp DESC LIMIT 10").all();
  res.json({ leaderboard: top });
}

module.exports = { getProgression, logExercice, logSession, leaderboard };