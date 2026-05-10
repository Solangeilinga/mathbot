// controllers/examController.js — Gestion des examens et résultats
const { query, queryOne } = require("../db/connection");

// Enregistrer les résultats d'un examen blanc
async function logExamResults(req, res) {
  const { chapitre, score, total, temps } = req.body;
  const userId = req.user.id;

  if (!chapitre || score === undefined || !total) {
    return res.status(400).json({ error: "Données d'examen incomplètes" });
  }

  try {
    const percentage = Math.round((score / total) * 100);

    // Insérer le résultat d'examen
    await query(
      `INSERT INTO exam_results (user_id, chapitre, score, total, percentage, temps_restant, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [userId, chapitre, score, total, percentage, temps]
    );

    // Mettre à jour la progression
    const isGoodScore = percentage >= 60;
    const xpGagne = isGoodScore ? 50 : 25;

    await query(
      `UPDATE progression SET sessions = sessions + 1, xp = xp + ?
       WHERE user_id = ? AND chapitre = ?`,
      [xpGagne, userId, chapitre]
    );

    // Récupérer le nouvel XP total
    const user = await queryOne(
      `SELECT SUM(xp) as totalXP FROM progression WHERE user_id = ?`,
      [userId]
    );

    res.json({
      message: `Examen terminé : ${percentage}% 🎉`,
      score: percentage,
      xpGagne,
      totalXP: user?.totalXP || 0,
      verdict:
        percentage >= 80
          ? "Excellent travail !"
          : percentage >= 60
          ? "Bon effort, continue !"
          : "À retravailler",
    });
  } catch (err) {
    console.error("[exam/log]", err.message);
    res.status(500).json({ error: "Erreur lors de l'enregistrement du résultat" });
  }
}

// Récupérer l'historique des examens
async function getExamHistory(req, res) {
  const userId = req.user.id;
  const { chapitre } = req.params;

  try {
    let sql = `SELECT chapitre, score, total, percentage, temps_restant, created_at
               FROM exam_results WHERE user_id = ?`;
    const params = [userId];

    if (chapitre) {
      sql += ` AND chapitre = ?`;
      params.push(chapitre);
    }

    sql += ` ORDER BY created_at DESC LIMIT 20`;

    const results = await query(sql, params);

    res.json({ history: results });
  } catch (err) {
    console.error("[exam/history]", err.message);
    res.status(500).json({ error: "Erreur lors de la récupération de l'historique" });
  }
}

// Récupérer les stats d'examen d'un chapitre
async function getExamStats(req, res) {
  const userId = req.user.id;
  const { chapitre } = req.params;

  try {
    const stats = await queryOne(
      `SELECT 
         COUNT(*) as attempts,
         AVG(percentage) as avgScore,
         MAX(percentage) as bestScore,
         MIN(percentage) as worstScore
       FROM exam_results WHERE user_id = ? AND chapitre = ?`,
      [userId, chapitre]
    );

    res.json({
      chapter: chapitre,
      attempts: stats?.attempts || 0,
      average: stats?.avgScore ? Math.round(stats.avgScore) : 0,
      best: stats?.bestScore || 0,
      worst: stats?.worstScore || 0,
    });
  } catch (err) {
    console.error("[exam/stats]", err.message);
    res.status(500).json({ error: "Erreur lors du calcul des stats" });
  }
}

module.exports = { logExamResults, getExamHistory, getExamStats };
