// controllers/memoryController.js — Mémoire pédagogique persistante
const { query, queryOne } = require("../db/connection");

// Modèle IA utilisé (Groq ou Gemini selon ce qui est configuré)
let _groqClient = null;
let _geminiClient = null;

function getAIClient() {
  if (process.env.GROQ_API_KEY) {
    if (!_groqClient) {
      const Groq = require("groq-sdk");
      _groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    return { type: "groq", client: _groqClient };
  }
  if (process.env.GEMINI_API_KEY) {
    if (!_geminiClient) {
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      _geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return { type: "gemini", client: _geminiClient };
  }
  throw new Error("Aucune clé API configurée (GROQ_API_KEY ou GEMINI_API_KEY)");
}

// ── Générer un résumé pédagogique après une session ─────────────────────────
async function generateMemory(userId, chapitre) {
  // Récupérer les 30 derniers messages de la session
  const history = await query(
    `SELECT role, content FROM conversation_history
     WHERE user_id = ? AND chapitre = ?
     ORDER BY created_at DESC LIMIT 30`,
    [userId, chapitre]
  );

  if (history.length < 4) return null; // Pas assez d'échanges pour analyser

  // Récupérer le profil existant
  const user = await queryOne(
    "SELECT profil_pedagogique FROM users WHERE id = ?", [userId]
  );
  const profilActuel = user?.profil_pedagogique || "";

  const conversationText = history
    .reverse()
    .map((m) => `${m.role === "user" ? "Élève" : "MathBot"}: ${m.content}`)
    .join("\n");

  const prompt = `Tu es un assistant pédagogique. Analyse cette conversation entre un élève et son tuteur MathBot sur le chapitre "${chapitre}" du BEPC burkinabè.

Conversation :
${conversationText}

Profil existant de l'élève :
${profilActuel || "Aucun profil encore"}

Génère un profil pédagogique MIS À JOUR en JSON strict (pas de markdown, pas de texte autour) :
{
  "points_forts": ["..."],
  "lacunes": ["..."],
  "notions_a_retravailler": ["..."],
  "niveau_global": "débutant|intermédiaire|avancé",
  "conseils_pour_tuteur": "..."
}`;

  try {
    const { type, client } = getAIClient();
    let result = "";

    if (type === "groq") {
      const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.3,
      });
      result = completion.choices[0]?.message?.content || "";
    } else {
      const model = client.getGenerativeModel({ model: "gemini-3.1-flash-lite" });
      const res = await model.generateContent(prompt);
      result = res.response.text();
    }

    // Nettoyer et parser le JSON
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const profil = JSON.parse(jsonMatch[0]);

    // Sauvegarder dans la BDD
    await query(
      "UPDATE users SET profil_pedagogique = ?, profil_updated_at = NOW() WHERE id = ?",
      [JSON.stringify(profil), userId]
    );

    return profil;
  } catch (err) {
    console.error("[memory/generate]", err.message);
    return null;
  }
}

// ── GET /api/memory — Récupérer le profil pédagogique ───────────────────────
async function getMemory(req, res) {
  try {
    const user = await queryOne(
      "SELECT profil_pedagogique, profil_updated_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!user?.profil_pedagogique) {
      return res.json({ profil: null, message: "Pas encore de profil — continue tes sessions !" });
    }

    res.json({
      profil: JSON.parse(user.profil_pedagogique),
      updated_at: user.profil_updated_at,
    });
  } catch (err) {
    console.error("[memory/get]", err.message);
    res.status(500).json({ error: "Erreur serveur." });
  }
}

// ── POST /api/memory/update — Déclencher la mise à jour du profil ────────────
async function updateMemory(req, res) {
  const { chapitre } = req.body;
  const userId = req.user.id;

  if (!chapitre) return res.status(400).json({ error: "chapitre requis." });

  try {
    const profil = await generateMemory(userId, chapitre);
    if (!profil) {
      return res.json({ message: "Pas assez d'échanges pour générer un profil.", profil: null });
    }
    res.json({ message: "Profil mis à jour !", profil });
  } catch (err) {
    console.error("[memory/update]", err.message);
    res.status(500).json({ error: "Erreur lors de la mise à jour du profil." });
  }
}

module.exports = { getMemory, updateMemory, generateMemory };
