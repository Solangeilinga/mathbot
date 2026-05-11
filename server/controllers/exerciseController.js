// controllers/exerciseController.js
// Vision : Gemini (fiable) — Texte : Groq ou Gemini selon config
const { query, queryOne } = require("../db/connection");

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) return null;
  const Groq = require("groq-sdk");
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) return null;
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

function buildPrompt(prenom, chapitre, profil) {
  const lacunes = profil?.lacunes?.filter(Boolean) || [];
  return `Tu es MathBot 🦉, tuteur IA de mathématiques BEPC au Burkina Faso.
Tu t'adresses à ${prenom} avec bienveillance.
${chapitre ? `Chapitre : ${chapitre}.` : ""}
${lacunes.length ? `Lacunes connues de ${prenom} : ${lacunes.join(", ")}.` : ""}

MISSION : Analyse l'exercice, explique la méthode, résous-le, puis génère 2 exercices similaires.

FORMAT OBLIGATOIRE (respecte exactement) :
📌 ANALYSE
[type d'exercice et notion mathématique]

📖 EXPLICATION
[méthode pas à pas, claire et progressive]

✅ SOLUTION
[résolution complète avec tous les calculs]

🎯 ENTRAÎNE-TOI !
Exercice 1 : [énoncé court et clair]
A. [option]
B. [option]
C. [option]
D. [option]
✓ Bonne réponse : [lettre]

Exercice 2 : [énoncé différent du premier]
A. [option]
B. [option]
C. [option]
D. [option]
✓ Bonne réponse : [lettre]

RÈGLES : français uniquement, exemples burkinabè si possible, encourageant avec ${prenom}, max 400 mots.`;
}

async function analyzeExercise(req, res) {
  const { imageBase64, imageType, exerciseText, chapitre } = req.body;
  const userId = req.user.id;

  if (!imageBase64 && !exerciseText?.trim()) {
    return res.status(400).json({ error: "Image ou texte requis." });
  }

  const userRow = await queryOne(
    "SELECT prenom, profil_pedagogique FROM users WHERE id = ?",
    [userId]
  );
  const prenom = (userRow?.prenom && userRow.prenom !== "undefined")
    ? userRow.prenom : "toi";
  const profil = userRow?.profil_pedagogique
    ? JSON.parse(userRow.profil_pedagogique) : null;

  const systemPrompt = buildPrompt(prenom, chapitre, profil);
  let reply = "";

  try {
    if (imageBase64) {
      // ── VISION : toujours Gemini (fiable et gratuit) ──────────────────────
      const gemini = getGeminiClient();
      if (!gemini) {
        return res.status(500).json({
          error: "GEMINI_API_KEY manquant — nécessaire pour la reconnaissance d'image.",
        });
      }

      const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
      const mime  = imageType || "image/jpeg";

      const result = await model.generateContent([
        {
          inlineData: {
            data: imageBase64,
            mimeType: mime,
          },
        },
        systemPrompt + "\n\nAnalyse l'exercice visible sur cette image et suis le format demandé.",
      ]);
      reply = result.response.text();

    } else {
      // ── TEXTE : Groq en priorité, Gemini en fallback ──────────────────────
      const userMessage = `Voici l'exercice à analyser :\n\n${exerciseText.trim()}\n\nAnalyse-le et suis le format demandé.`;

      const groq = getGroqClient();
      if (groq) {
        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user",   content: userMessage },
          ],
          max_tokens: 1200,
          temperature: 0.7,
        });
        reply = completion.choices[0]?.message?.content || "";
      } else {
        const gemini = getGeminiClient();
        if (!gemini) throw new Error("Aucune clé API disponible.");
        const model  = gemini.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: systemPrompt,
        });
        const result = await model.generateContent(userMessage);
        reply = result.response.text();
      }
    }

    // Sauvegarde dans l'historique
    if (chapitre) {
      const userMsg = imageBase64
        ? "[Exercice envoyé en image]"
        : `[Exercice soumis] : ${exerciseText?.slice(0, 200)}`;
      await query(
        "INSERT INTO conversation_history (user_id, chapitre, role, content) VALUES (?, ?, 'user', ?)",
        [userId, chapitre, userMsg]
      );
      await query(
        "INSERT INTO conversation_history (user_id, chapitre, role, content) VALUES (?, ?, 'assistant', ?)",
        [userId, chapitre, reply]
      );
    }

    res.json({ reply, hasImage: !!imageBase64 });

  } catch (err) {
    console.error("[exercise/analyze]", err.message);
    let status = 502;
    let msg = "Erreur IA — réessaie dans quelques secondes.";
    if (err.message.includes("quota") || err.message.includes("rate")) {
      status = 429; msg = "Limite API atteinte, réessaie dans quelques secondes.";
    } else if (err.message.includes("GEMINI_API_KEY")) {
      status = 500; msg = err.message;
    } else if (err.message.includes("image") || err.message.includes("vision")) {
      msg = "Impossible de lire l'image. Vérifie que c'est bien une photo claire d'exercice.";
    }
    res.status(status).json({ error: msg });
  }
}

module.exports = { analyzeExercise };