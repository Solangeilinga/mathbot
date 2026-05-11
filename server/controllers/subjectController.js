// controllers/subjectController.js
const { query, queryOne } = require("../db/connection");

// ── Récupérer un sujet précis ─────────────────────────────────────────────────
async function getSubject(req, res) {
  const { session, chapitre } = req.params;
  try {
    const subject = await queryOne(
      "SELECT id, session, chapitre, sujet FROM exam_subjects WHERE session = ? AND chapitre = ?",
      [session, chapitre]
    );
    if (!subject) {
      return res.status(404).json({ error: `Sujet introuvable (session: ${session}, chapitre: ${chapitre})` });
    }
    res.json(subject);
  } catch (err) {
    console.error("[subject/get]", err.message);
    res.status(500).json({ error: "Erreur lors de la récupération du sujet" });
  }
}

// ── Lister les sessions ───────────────────────────────────────────────────────
async function listSessions(req, res) {
  try {
    const sessions = await query("SELECT DISTINCT session FROM exam_subjects ORDER BY session DESC");
    res.json({ sessions: sessions.map(s => s.session) });
  } catch (err) {
    console.error("[subject/sessions]", err.message);
    res.status(500).json({ error: "Erreur lors de la récupération des sessions" });
  }
}

// ── Lister les sujets d'une session ──────────────────────────────────────────
async function listSubjectsBySession(req, res) {
  const { session } = req.params;
  try {
    const subjects = await query(
      "SELECT id, session, chapitre FROM exam_subjects WHERE session = ? ORDER BY chapitre",
      [session]
    );
    res.json({ subjects });
  } catch (err) {
    console.error("[subject/list]", err.message);
    res.status(500).json({ error: "Erreur lors de la récupération des sujets" });
  }
}

// ── Correction IA ─────────────────────────────────────────────────────────────
async function correctSubject(req, res) {
  const { sujet, reponses } = req.body;
  if (!sujet || !reponses) {
    return res.status(400).json({ error: "Sujet et réponses requis" });
  }

  try {
    let client, type;
    if (process.env.GROQ_API_KEY) {
      const Groq = require("groq-sdk");
      client = new Groq({ apiKey: process.env.GROQ_API_KEY });
      type   = "groq";
    } else if (process.env.GEMINI_API_KEY) {
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      type   = "gemini";
    } else {
      throw new Error("Aucune clé API disponible");
    }

    const systemPrompt = `Tu es un correcteur d'examen BEPC au Burkina Faso.
Corrige les réponses de l'élève de manière pédagogique et encourageante.
Format de réponse :
1. Note obtenue (sur 20)
2. Réponses correctes/incorrectes commentées
3. Explications des erreurs
4. Conseils pour progresser`;

    const userMsg = `SUJET :\n${sujet}\n\nRÉPONSES DE L'ÉLÈVE :\n${reponses}\n\nCorrige et note ce travail.`;
    let correction = "";

    if (type === "groq") {
      const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: userMsg },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });
      correction = completion.choices[0]?.message?.content || "";
    } else {
      const model  = client.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: systemPrompt });
      const result = await model.generateContent(userMsg);
      correction   = result.response.text();
    }

    const noteMatch = correction.match(/(\d+(?:[.,]\d+)?)\s*\/\s*20/);
    const note = noteMatch ? parseFloat(noteMatch[1].replace(",", ".")) : 10;

    res.json({ note, correction, percentage: Math.round((note / 20) * 100) });
  } catch (err) {
    console.error("[subject/correct]", err.message);
    res.status(502).json({ error: "Erreur IA lors de la correction" });
  }
}

module.exports = { getSubject, listSessions, listSubjectsBySession, correctSubject };