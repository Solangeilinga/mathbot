// controllers/chatController.js
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

// Résout le prénom depuis la DB ou le token JWT — jamais undefined/null
async function resolvePrenom(userId, reqUser) {
  // 1. Depuis la DB (source de vérité)
  try {
    const dbUser = await queryOne("SELECT prenom, nom FROM users WHERE id = ?", [userId]);
    if (dbUser?.prenom && dbUser.prenom !== "undefined") return { prenom: dbUser.prenom, nom: dbUser.nom };
  } catch { /* fallback */ }
  // 2. Depuis le token JWT
  if (reqUser?.prenom && reqUser.prenom !== "undefined") return { prenom: reqUser.prenom, nom: reqUser.nom };
  // 3. Fallback générique
  return { prenom: "toi", nom: "" };
}

// ── Sélectionne aléatoirement parmi un tableau ────────────────────────────────
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ── System prompt humain, jamais "undefined" ──────────────────────────────────
function buildSystemPrompt(chapitre, profil, prenom) {
  // prenom est garanti non-undefined ici
  const h = new Date().getHours();
  const moment = h < 12 ? "matin" : h < 18 ? "après-midi" : "soir";

  let profilSection = "";
  if (profil) {
    const lacunes = (profil.lacunes || []).filter(Boolean);
    const forts = (profil.points_forts || []).filter(Boolean);
    const notions = (profil.notions_a_retravailler || []).filter(Boolean);
    profilSection = `
═══ PROFIL DE ${prenom.toUpperCase()} ═══
• Points forts : ${forts.length ? forts.join(", ") : "à découvrir"}
• Lacunes : ${lacunes.length ? lacunes.join(", ") : "aucune détectée"}
• À retravailler : ${notions.length ? notions.join(", ") : "rien de particulier"}
• Niveau : ${profil.niveau_global || "en cours d'évaluation"}
${lacunes.length ? `\n⚠️ Si l'occasion se présente, propose à ${prenom} de revenir sur : ${lacunes.slice(0, 2).join(", ")}.` : ""}`;
  }

  return `Tu es MathBot 🦉, tuteur IA de mathématiques BEPC au Burkina Faso.
Ton élève s'appelle ${prenom}. C'est le ${moment}.
Chapitre actuel : ${chapitre}.
${profilSection}

━━━ COMMENT TU PARLES ━━━
• Utilise le prénom "${prenom}" naturellement — pas à chaque phrase, mais souvent
• EXEMPLES BONS : "Bien joué ${prenom} !", "Tu vois ${prenom}, ici...", "Continue comme ça !"
• EXEMPLES MAUVAIS : "l'utilisateur", "l'élève", "l'apprenant" → n'utilise JAMAIS ces mots froids
• Varie tes formulations — jamais deux fois la même intro
• Tu es chaleureux, humain, pas robotique
• Exemples du quotidien burkinabè : marché de Ouaga, mil, sorgho, CFA, SONABEL, navetanes

━━━ MISSIONS ━━━
1. Expliquer les notions BEPC progressivement
2. Générer des exercices variés avec 4 options A B C D
3. Corriger pas-à-pas avec encouragement sincère
4. Adapter le niveau selon les réponses

━━━ FORMAT EXERCICE (OBLIGATOIRE) ━━━
Question sur une ligne, puis :
A. [option]
B. [option]
C. [option]
D. [option]
✓ Bonne réponse : [lettre] (dans ta correction uniquement, jamais dans la question)

━━━ RÈGLES ━━━
• Toujours en français • Max 250 mots • Jamais la même intro deux fois de suite`;
}

// ── Instruction de bienvenue contextuelle ────────────────────────────────────
function buildWelcomeInstruction(prenom, chapitre, profil, hasHistory) {
  const h = new Date().getHours();
  const salutOptions = h < 12
    ? ["Bonjour", "Bon matin", "Belle matinée"]
    : h < 18 ? ["Bonjour", "Bonne après-midi", "Salut", "Hey"]
    : ["Bonsoir", "Salut", "Bonne soirée"];
  const salut = pick(salutOptions);

  const lacunes = (profil?.lacunes || []).filter(Boolean);
  const notions = (profil?.notions_a_retravailler || []).filter(Boolean);
  const niveau = profil?.niveau_global || "";

  if (!hasHistory) {
    return `Génère un message de bienvenue pour ${prenom} qui commence sa PREMIÈRE session sur "${chapitre}".
- Commence par "${salut} ${prenom} !" avec une formule chaleureuse et originale
- Présente-toi brièvement (tu es MathBot, son tuteur de maths)
- Demande comment ${prenom} se sent aujourd'hui
- Propose : commencer par une explication OU directement un exercice
- Ton enthousiaste et bienveillant. MAX 80 MOTS. Utilise le prénom naturellement.`;
  }

  if (lacunes.length > 0 || notions.length > 0) {
    const points = [...lacunes, ...notions].slice(0, 2).join(" et ");
    return `Génère un message de bienvenue pour ${prenom} qui revient sur "${chapitre}".
Tu te souviens qu'il/elle avait des difficultés en : ${points}.
- Commence par "${salut} ${prenom} !" + formule de retrouvaille chaleureuse (VARIE !)
- Mentionne naturellement que tu te souviens de ses difficultés en ${points}
- Demande gentiment à ${prenom} si on retravaille ça aujourd'hui, ou autre chose
- Positif, pas de jugement. Utilise le prénom. MAX 90 MOTS.`;
  }

  if (niveau === "avancé") {
    return `Génère un message de bienvenue pour ${prenom} (niveau avancé) qui revient sur "${chapitre}".
- "${salut} ${prenom} !" + ton complice et valorisant
- Valorise les bons résultats de ${prenom} sans être condescendant
- Propose : révision approfondie OU défi BEPC difficile. Demande sa préférence.
MAX 80 MOTS.`;
  }

  const formules = [
    `Content(e) de te revoir ${prenom} !`,
    `Alors ${prenom}, prêt(e) à reprendre ?`,
    `${prenom}, te revoilà ! On continue ?`,
    `Heureux de retrouver ${prenom} aujourd'hui !`,
  ];
  const formule = pick(formules);

  return `Génère un message de bienvenue pour ${prenom} qui revient travailler sur "${chapitre}".
- Commence par "${salut} ${prenom} ! ${formule}" (VARIES cette formule !)
- Demande comment va ${prenom} et s'il/elle est en forme
- Propose 2-3 options : réviser une notion, faire des exercices, ou revoir un point précis
- Ton naturel et humain. MAX 85 MOTS.`;
}

async function sendMessage(req, res) {
  const { message, chapitre } = req.body;
  const userId = req.user.id;
  if (!message || !chapitre)
    return res.status(400).json({ error: "message et chapitre requis." });

  const [{ prenom }, historyRows, profilRow] = await Promise.all([
    resolvePrenom(userId, req.user),
    query(
      "SELECT role, content FROM conversation_history WHERE user_id = ? AND chapitre = ? ORDER BY created_at ASC LIMIT 20",
      [userId, chapitre]
    ),
    queryOne("SELECT profil_pedagogique FROM users WHERE id = ?", [userId]),
  ]);

  const profil = profilRow?.profil_pedagogique
    ? JSON.parse(profilRow.profil_pedagogique)
    : null;

  await query(
    "INSERT INTO conversation_history (user_id, chapitre, role, content) VALUES (?, ?, 'user', ?)",
    [userId, chapitre, message]
  );

  try {
    const { client, type } = getClient();
    const systemPrompt = buildSystemPrompt(chapitre, profil, prenom);
    let reply = "";

    if (type === "groq") {
      const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...historyRows.map(m => ({ role: m.role, content: m.content })),
          { role: "user", content: message },
        ],
        max_tokens: 600,
        temperature: 0.85,
      });
      reply = completion.choices[0]?.message?.content || "";
    } else {
      const model = client.getGenerativeModel({
        model: "gemini-2.0-flash-lite",
        systemInstruction: systemPrompt,
      });
      const chat = model.startChat({
        history: historyRows.map(m => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      });
      const result = await chat.sendMessage(message);
      reply = result.response.text();
    }

    await query(
      "INSERT INTO conversation_history (user_id, chapitre, role, content) VALUES (?, ?, 'assistant', ?)",
      [userId, chapitre, reply]
    );
    await query(
      "UPDATE progression SET sessions = sessions + 1 WHERE user_id = ? AND chapitre = ?",
      [userId, chapitre]
    );

    res.json({ reply });

    const count = await queryOne(
      "SELECT COUNT(*) as cnt FROM conversation_history WHERE user_id = ? AND chapitre = ? AND role = 'assistant'",
      [userId, chapitre]
    );
    if (count?.cnt % 10 === 0) {
      generateMemory(userId, chapitre).catch(e => console.warn("[memory bg]", e.message));
    }
  } catch (err) {
    console.error("[chat/message]", err.message);
    let status = 502, msg = "Erreur IA — Service indisponible";
    if (err.message.includes("quota") || err.message.includes("rate")) {
      status = 429; msg = "Limite API atteinte, réessaie dans quelques secondes";
    } else if (err.message.includes("Aucune clé")) {
      status = 500; msg = "Configuration IA manquante";
    }
    res.status(status).json({ error: msg });
  }
}

// ── Endpoint bienvenue ────────────────────────────────────────────────────────
async function getWelcome(req, res) {
  const { chapitre } = req.query;
  const userId = req.user.id;
  if (!chapitre) return res.status(400).json({ error: "chapitre requis." });

  try {
    const [{ prenom }, histCount, profilRow] = await Promise.all([
      resolvePrenom(userId, req.user),
      queryOne(
        "SELECT COUNT(*) as cnt FROM conversation_history WHERE user_id = ? AND chapitre = ?",
        [userId, chapitre]
      ),
      queryOne("SELECT profil_pedagogique FROM users WHERE id = ?", [userId]),
    ]);

    const profil = profilRow?.profil_pedagogique
      ? JSON.parse(profilRow.profil_pedagogique)
      : null;
    const hasHistory = (histCount?.cnt || 0) > 2;
    const instruction = buildWelcomeInstruction(prenom, chapitre, profil, hasHistory);
    const systemPrompt = buildSystemPrompt(chapitre, profil, prenom);

    const { client, type } = getClient();
    let reply = "";

    if (type === "groq") {
      const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: instruction },
        ],
        max_tokens: 200,
        temperature: 0.92,
      });
      reply = completion.choices[0]?.message?.content || "";
    } else {
      const model = client.getGenerativeModel({
        model: "gemini-2.0-flash-lite",
        systemInstruction: systemPrompt,
      });
      const result = await model.generateContent(instruction);
      reply = result.response.text();
    }

    await query(
      "INSERT INTO conversation_history (user_id, chapitre, role, content) VALUES (?, ?, 'assistant', ?)",
      [userId, chapitre, reply]
    );

    res.json({ reply, hasHistory });
  } catch (err) {
    console.error("[chat/welcome]", err.message);
    res.status(502).json({ error: "Erreur génération message de bienvenue." });
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

module.exports = { sendMessage, clearHistory, getHistory, getWelcome };