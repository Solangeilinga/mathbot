// controllers/ttsController.js — TTS via Gemini 2.0 Flash (expérimental)
const https = require("https");

async function synthesize(req, res) {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: "text requis." });

  // Nettoyer le texte
  const clean = text
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, "")
    .replace(/[⬡✅📐🔢💡➡🎯]/g, "")
    .replace(/\*+/g, "")
    .replace(/#+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1000);

  const body = JSON.stringify({
    contents: [{
      parts: [{ text: `Lis ce texte à voix haute en français, avec une voix pédagogique, calme et bienveillante d'un tuteur : "${clean}"` }]
    }],
    generationConfig: {
      response_modalities: ["AUDIO"],
      speech_config: {
        voice_config: {
          prebuilt_voice_config: {
            voice_name: "Charon"  // voix masculine naturelle
          }
        }
      }
    }
  });

  const apiKey = process.env.GEMINI_API_KEY;
  // Utiliser le modèle expérimental qui supporte l'audio
  const model = "gemini-2.0-flash-exp";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const audioContent = await fetchGeminiTTS(url, body);
    res.json({ audioContent, mimeType: "audio/wav" });
  } catch (err) {
    console.error("[tts] Erreur Gemini:", err.message);
    // Fallback : utiliser la synthèse vocale du navigateur
    res.status(502).json({
      error: "Gemini TTS indisponible, utilise la voix navigateur.",
      fallback: true,
    });
  }
}

function fetchGeminiTTS(url, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              reject(new Error(parsed.error.message || "Erreur Gemini TTS"));
              return;
            }
            const part = parsed.candidates?.[0]?.content?.parts?.[0];
            if (part?.inlineData?.data) {
              resolve(part.inlineData.data);
            } else {
              reject(new Error("Pas d'audio dans la réponse Gemini"));
            }
          } catch (err) {
            reject(new Error("Réponse Gemini invalide"));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

module.exports = { synthesize };