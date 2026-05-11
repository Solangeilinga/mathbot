// controllers/ttsController.js
// Priorité : ElevenLabs (timeout 4s) → Gemini TTS → silence (pas de navigateur)
const https = require("https");

function cleanText(text) {
  return (text || "")
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, "")
    .replace(/[⬡✅📐🔢💡➡🎯🦉━═📌📖•·]/g, "")
    .replace(/\*+|#+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 800);
}

// ── ElevenLabs avec timeout ───────────────────────────────────────────────────
function elevenLabsTTS(text, timeoutMs = 4000) {
  return new Promise((resolve, reject) => {
    const apiKey  = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
    const body    = JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    });

    const timer = setTimeout(() => reject(new Error("ElevenLabs timeout")), timeoutMs);

    const req = https.request(
      {
        hostname: "api.elevenlabs.io",
        path: `/v1/text-to-speech/${voiceId}`,
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
          let err = "";
          res.on("data", c => err += c);
          res.on("end", () => { clearTimeout(timer); reject(new Error(`ElevenLabs ${res.statusCode}: ${err}`)); });
          return;
        }
        const chunks = [];
        res.on("data", c => chunks.push(c));
        res.on("end", () => { clearTimeout(timer); resolve(Buffer.concat(chunks).toString("base64")); });
      }
    );
    req.on("error", e => { clearTimeout(timer); reject(e); });
    req.write(body);
    req.end();
  });
}

// ── Gemini TTS ────────────────────────────────────────────────────────────────
function geminiTTS(text) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) { reject(new Error("Pas de clé Gemini")); return; }

    const body = JSON.stringify({
      contents: [{ parts: [{ text: `Lis ce texte en français avec une voix pédagogique et bienveillante : "${text}"` }] }],
      generationConfig: {
        response_modalities: ["AUDIO"],
        speech_config: { voice_config: { prebuilt_voice_config: { voice_name: "Charon" } } },
      },
    });
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

    const req = https.request(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
    }, (res) => {
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

// ── Handler ───────────────────────────────────────────────────────────────────
async function synthesize(req, res) {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: "text requis." });

  const clean = cleanText(text);
  if (!clean) return res.json({ silent: true }); // rien à lire

  // 1. ElevenLabs
  if (process.env.ELEVENLABS_API_KEY) {
    try {
      const audio = await elevenLabsTTS(clean, 4000);
      return res.json({ audioContent: audio, mimeType: "audio/mpeg", source: "elevenlabs" });
    } catch (err) {
      console.warn("[tts] ElevenLabs:", err.message);
    }
  }

  // 2. Gemini TTS
  if (process.env.GEMINI_API_KEY) {
    try {
      const { audio, mime } = await geminiTTS(clean);
      return res.json({ audioContent: audio, mimeType: mime, source: "gemini" });
    } catch (err) {
      console.warn("[tts] Gemini:", err.message);
    }
  }

  // 3. Aucune voix disponible → silence (pas de navigateur)
  return res.json({ silent: true, source: "none" });
}

module.exports = { synthesize };