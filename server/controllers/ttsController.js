// controllers/ttsController.js
// Priorité : ElevenLabs > Gemini TTS > Web Speech API (navigateur)
const https = require("https");

function cleanText(text) {
  return (text || "")
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, "")
    .replace(/[⬡✅📐🔢💡➡🎯🦉━═•·]/g, "")
    .replace(/\*+|#+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 900);
}

// ── ElevenLabs TTS ────────────────────────────────────────────────────────────
async function elevenLabsTTS(text) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("Pas de clé ElevenLabs");

  // Voix "Rachel" (fr) ou "Bella" — change l'ID selon ta préférence
  // IDs populaires : 21m00Tcm4TlvDq8ikWAM (Rachel EN), EXAVITQu4vr4xnSDxMaL (Bella EN)
  // Pour voix française : cherche "French" dans le catalogue ElevenLabs
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const body = JSON.stringify({
    text,
    model_id: "eleven_multilingual_v2", // supporte le français
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.3,
      use_speaker_boost: true,
    },
  });

  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const req = https.request(
      {
        hostname: urlObj.hostname,
        path: urlObj.pathname,
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          Accept: "audio/mpeg",
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          let errData = "";
          res.on("data", c => errData += c);
          res.on("end", () => reject(new Error(`ElevenLabs ${res.statusCode}: ${errData}`)));
          return;
        }
        const chunks = [];
        res.on("data", c => chunks.push(c));
        res.on("end", () => {
          const buf = Buffer.concat(chunks);
          resolve(buf.toString("base64"));
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ── Gemini TTS ────────────────────────────────────────────────────────────────
async function geminiTTS(text) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Pas de clé Gemini");

  const body = JSON.stringify({
    contents: [{ parts: [{ text: `Lis en français avec une voix pédagogique et bienveillante : "${text}"` }] }],
    generationConfig: {
      response_modalities: ["AUDIO"],
      speech_config: { voice_config: { prebuilt_voice_config: { voice_name: "Charon" } } },
    },
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: "POST", headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } }, (res) => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) { reject(new Error(parsed.error.message)); return; }
          const part = parsed.candidates?.[0]?.content?.parts?.[0];
          if (part?.inlineData?.data) resolve({ audio: part.inlineData.data, mime: "audio/wav" });
          else reject(new Error("Pas d'audio Gemini"));
        } catch { reject(new Error("Réponse Gemini invalide")); }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ── Handler principal ─────────────────────────────────────────────────────────
async function synthesize(req, res) {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: "text requis." });

  const clean = cleanText(text);
  if (!clean) return res.json({ fallback: true, source: "browser", cleanText: "" });

  // 1. ElevenLabs (meilleure qualité)
  if (process.env.ELEVENLABS_API_KEY) {
    try {
      const audio = await elevenLabsTTS(clean);
      return res.json({ audioContent: audio, mimeType: "audio/mpeg", source: "elevenlabs" });
    } catch (err) {
      console.warn("[tts] ElevenLabs échoué:", err.message);
    }
  }

  // 2. Gemini TTS
  if (process.env.GEMINI_API_KEY) {
    try {
      const { audio, mime } = await geminiTTS(clean);
      return res.json({ audioContent: audio, mimeType: mime, source: "gemini" });
    } catch (err) {
      console.warn("[tts] Gemini TTS échoué:", err.message);
    }
  }

  // 3. Fallback navigateur
  return res.json({ fallback: true, source: "browser", cleanText: clean });
}

module.exports = { synthesize };