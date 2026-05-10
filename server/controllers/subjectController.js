// controllers/subjectController.js — Gestion des sujets d'examen
const { query, queryOne } = require("../db/connection");
const { query: queryAI } = require("../controllers/chatController");

// Récupérer un sujet d'examen
async function getSubject(req, res) {
  const { session, chapitre } = req.params;

  try {
    const subject = await queryOne(
      `SELECT id, session, chapitre, sujet FROM exam_subjects 
       WHERE session = ? AND chapitre = ?`,
      [session, chapitre]
    );

    if (!subject) {
      return res.status(404).json({ error: "Sujet non trouvé" });
    }

    res.json(subject);
  } catch (err) {
    console.error("[subject/get]", err.message);
    res.status(500).json({ error: "Erreur lors de la récupération du sujet" });
  }
}

// Lister toutes les sessions disponibles
async function listSessions(req, res) {
  try {
    const sessions = await query(
      `SELECT DISTINCT session FROM exam_subjects ORDER BY session DESC`
    );

    res.json({ sessions: sessions.map(s => s.session) });
  } catch (err) {
    console.error("[subject/sessions]", err.message);
    res.status(500).json({ error: "Erreur lors de la récupération des sessions" });
  }
}

// Lister les sujets d'une session
async function listSubjectsBySession(req, res) {
  const { session } = req.params;

  try {
    const subjects = await query(
      `SELECT id, session, chapitre FROM exam_subjects WHERE session = ? ORDER BY chapitre`,
      [session]
    );

    res.json({ subjects });
  } catch (err) {
    console.error("[subject/list]", err.message);
    res.status(500).json({ error: "Erreur lors de la récupération des sujets" });
  }
}

// Corriger le sujet avec l'IA
async function correctSubject(req, res) {
  const { sujet, reponses, userId } = req.body;

  if (!sujet || !reponses) {
    return res.status(400).json({ error: "Sujet et réponses requis" });
  }

  try {
    const { client, type } = (() => {
      if (process.env.GROQ_API_KEY) {
        const Groq = require("groq-sdk");
        return { client: new Groq({ apiKey: process.env.GROQ_API_KEY }), type: "groq" };
      } else if (process.env.GEMINI_API_KEY) {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        return { client: new GoogleGenerativeAI(process.env.GEMINI_API_KEY), type: "gemini" };
      }
      throw new Error("Aucune clé API disponible");
    })();

    const systemPrompt = `Tu es un correcteur d'examen BEPC au Burkina Faso.
Tu dois corriger les réponses de l'élève de manière pédagogique et encourageante.
Format de réponse :
1. Note obtenue (sur 20)
2. Réponses correctes/incorrectes commentées
3. Explications des erreurs
4. Conseils pour progresser
Sois juste mais encourageant.`;

    const userMessage = `SUJET D'EXAMEN:
${sujet}

RÉPONSES DE L'ÉLÈVE:
${reponses}

Veuillez corriger et noter ce travail.`;

    let correction = "";

    if (type === "groq") {
      const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });
      correction = completion.choices[0]?.message?.content || "";
    } else {
      const model = client.getGenerativeModel({
        model: "gemini-3.1-flash-lite",
        systemInstruction: systemPrompt,
      });
      const result = await model.generateContent(userMessage);
      correction = result.response.text();
    }

    // Extraire la note du texte (format "Note: XX/20")
    const noteMatch = correction.match(/(\d+)\/20/);
    const note = noteMatch ? parseInt(noteMatch[1]) : 10;

    res.json({
      note,
      correction,
      percentage: Math.round((note / 20) * 100),
    });
  } catch (err) {
    console.error("[subject/correct]", err.message);
    res.status(502).json({
      error: "Erreur IA lors de la correction",
      detail: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
}

module.exports = { getSubject, listSessions, listSubjectsBySession, correctSubject };
