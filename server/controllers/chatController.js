// controllers/chatController.js — Chat IA avec mémoire pédagogique
const { query, queryOne } = require("../db/connection");
const { generateMemory } = require("./memoryController");

let _client = null;
let _clientType = null;

function getClient() {
  if (_client) return { client: _client, type: _clientType };

  if (process.env.GROQ_API_KEY) {
    const Groq = require("groq-sdk");
    _client = new Groq({ apiKey: process.env.GROQ_API_KEY });
    _clientType = "groq";
  } else if (process.env.GEMINI_API_KEY) {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    _client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    _clientType = "gemini";
  } else {
    throw new Error("Aucune clé API (GROQ_API_KEY ou GEMINI_API_KEY)");
  }
  return { client: _client, type: _clientType };
}

// System prompt enrichi avec le profil pédagogique de l'élève
function buildSystemPrompt(chapitre, profil, prenom) {
  let profilSection = "";

  if (profil) {
    profilSection = `
PROFIL PÉDAGOGIQUE DE L'ÉLÈVE (basé sur les sessions passées) :
- Points forts : ${profil.points_forts?.join(", ") || "à découvrir"}
- Lacunes identifiées : ${profil.lacunes?.join(", ") || "aucune encore"}
- Notions à retravailler : ${profil.notions_a_retravailler?.join(", ") || "aucune"}
- Niveau global : ${profil.niveau_global || "à évaluer"}
- Conseils : ${profil.conseils_pour_tuteur || "adapter le rythme"}

IMPORTANT : Tiens compte de ce profil pour adapter tes explications et exercices.
Si l'élève a des lacunes identifiées, travaille-les en priorité.`;
  }

  return `Tu es MathBot, le tuteur IA de mathématiques pour le BEPC au Burkina Faso.
Tu t'adresses à ${prenom || "l'élève"} avec bienveillance et encouragement.
Chapitre actuel : ${chapitre}.
${profilSection}

TES MISSIONS :
1. Expliquer les notions du BEPC de façon claire et progressive
2. Générer des exercices BEPC authentiques avec 4 options A, B, C, D
3. Corriger les réponses pas-à-pas avec la méthode complète
4. Adapter ton enseignement aux lacunes détectées

RÈGLES :
- Réponds TOUJOURS en français
- Sois encourageant et pédagogique
- Utilise des exemples du quotidien burkinabè (marché, mil, CFA)
- Pour les exercices : indique clairement A. B. C. D. sur des lignes séparées
- Marque la bonne réponse avec ✓ à la fin de ta correction
- Limite tes réponses à 250 mots maximum
- Célèbre chaque progrès de l'élève`;
}

async function sendMessage(req, res) {
  const { message, chapitre } = req.body;
  const userId = req.user.id;
  if (!message || !chapitre)
    return res.status(400).json({ error: "message et chapitre requis." });

  // Récupérer l'historique + le profil pédagogique de l'élève
  const [history, user] = await Promise.all([
    query(
      "SELECT role, content FROM conversation_history WHERE user_id = ? AND chapitre = ? ORDER BY created_at ASC LIMIT 20",
      [userId, chapitre]
    ),
    queryOne(
      "SELECT prenom, profil_pedagogique FROM users WHERE id = ?",
      [userId]
    ),
  ]);

  const profil = user?.profil_pedagogique
    ? JSON.parse(user.profil_pedagogique)
    : null;

  // Sauvegarder le message entrant
  await query(
    "INSERT INTO conversation_history (user_id, chapitre, role, content) VALUES (?, ?, 'user', ?)",
    [userId, chapitre, message]
  );

  try {
    const { client, type } = getClient();
    const systemPrompt = buildSystemPrompt(chapitre, profil, user?.prenom);
    let reply = "";

    if (type === "groq") {
      const messages = [
        { role: "system", content: systemPrompt },
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: message },
      ];
      const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages,
        max_tokens: 600,
        temperature: 0.7,
      });
      reply = completion.choices[0]?.message?.content || "";
    } else {
      const model = client.getGenerativeModel({
        model: "gemini-3.1-flash-lite",
        systemInstruction: systemPrompt,
      });
      const geminiHistory = history.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));
      const chat = model.startChat({ history: geminiHistory });
      const result = await chat.sendMessage(message);
      reply = result.response.text();
    }

    // Sauvegarder la réponse
    await query(
      "INSERT INTO conversation_history (user_id, chapitre, role, content) VALUES (?, ?, 'assistant', ?)",
      [userId, chapitre, reply]
    );

    await query(
      "UPDATE progression SET sessions = sessions + 1 WHERE user_id = ? AND chapitre = ?",
      [userId, chapitre]
    );

    res.json({ reply });

    // Mettre à jour la mémoire pédagogique en arrière-plan
    // (toutes les 10 réponses de l'IA dans ce chapitre)
    const count = await queryOne(
      "SELECT COUNT(*) as cnt FROM conversation_history WHERE user_id = ? AND chapitre = ? AND role = 'assistant'",
      [userId, chapitre]
    );
    if (count?.cnt % 10 === 0) {
      generateMemory(userId, chapitre).catch((err) =>
        console.warn("[memory bg update]", err.message)
      );
    }

  } catch (err) {
    console.error("[chat/message]", err.message);
    
    // Déterminer le type d'erreur pour un message plus spécifique
    let statusCode = 502;
    let errorMessage = "Erreur IA — Service indisponible";
    
    if (err.message.includes("API") || err.message.includes("quota")) {
      errorMessage = "Erreur IA — Limite API atteinte";
      statusCode = 429;
    } else if (err.message.includes("Aucune clé API")) {
      errorMessage = "Configuration IA manquante";
      statusCode = 500;
    }
    
    res.status(statusCode).json({
      error: errorMessage,
      detail: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
}

async function getHistory(req, res) {
  const rows = await query(
    "SELECT role, content, created_at FROM conversation_history WHERE user_id = ? AND chapitre = ? ORDER BY created_at ASC LIMIT 50",
    [req.user.id, req.params.chapitre]
  );
  res.json({ history: rows });
}

async function clearHistory(req, res) {
  await query(
    "DELETE FROM conversation_history WHERE user_id = ? AND chapitre = ?",
    [req.user.id, req.params.chapitre]
  );
  res.json({ message: "Historique effacé." });
}

module.exports = { sendMessage, clearHistory, getHistory };
