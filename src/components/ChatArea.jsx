import { useState, useRef, useEffect, useCallback } from "react";
import VoiceButton from "./VoiceButton";
import SpeakButton from "./SpeakButton";
import { chatAPI, progressionAPI, ttsAPI } from "../utils/api";
import { useSpeechRecognition } from "../hooks/useSpeech";

const QUICK_ACTIONS = [
  { label: "💡 Expliquer",        text: "Je ne comprends pas, explique autrement avec un exemple simple du quotidien burkinabè" },
  { label: "➡ Exercice suivant",  text: "Donne-moi un nouvel exercice BEPC varié avec 4 options A B C D" },
  { label: "🎯 Indice",           text: "Donne-moi un indice sans donner la réponse directement" },
  { label: "📐 Formule",          text: "Rappelle-moi la formule principale de ce chapitre avec un exemple concret" },
  { label: "🔁 Revoir les bases", text: "Je veux revoir les bases du chapitre depuis le début, étape par étape" },
];

// ── TTS : Gemini si dispo, sinon Web Speech API du navigateur ─────────────────
async function speakText(text, { onStart, onEnd, onError } = {}) {
  // 1. Essai Gemini TTS via backend
  try {
    const data = await ttsAPI.synthesize(text);

    if (data.audioContent) {
      // Gemini a retourné de l'audio base64
      const bytes = atob(data.audioContent);
      const buf = new Uint8Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) buf[i] = bytes.charCodeAt(i);
      const blob = new Blob([buf], { type: data.mimeType || "audio/wav" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onplay = onStart;
      audio.onended = () => { URL.revokeObjectURL(url); onEnd?.(); };
      audio.onerror = () => { URL.revokeObjectURL(url); speakBrowser(data.cleanText || text, { onStart, onEnd, onError }); };
      audio.play();
      return { type: "gemini", audio };
    }

    if (data.fallback) {
      // Backend signale d'utiliser le navigateur (Groq = pas de TTS)
      return speakBrowser(data.cleanText || text, { onStart, onEnd, onError });
    }
  } catch {
    // Backend inaccessible → navigateur directement
  }

  return speakBrowser(text, { onStart, onEnd, onError });
}

function speakBrowser(text, { onStart, onEnd, onError } = {}) {
  if (!window.speechSynthesis) { onEnd?.(); return null; }
  window.speechSynthesis.cancel();

  const clean = (text || "")
    .replace(/[^\p{L}\p{N}\s.,!?;:'«»()\-]/gu, " ")
    .replace(/\*+|#+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 700);

  if (!clean) { onEnd?.(); return null; }

  const utt = new SpeechSynthesisUtterance(clean);
  utt.lang = "fr-FR";
  utt.rate = 0.9;
  utt.pitch = 1.05;

  const applyVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const fr = voices.find(v => v.lang === "fr-FR" && v.localService)
      || voices.find(v => v.lang.startsWith("fr"))
      || null;
    if (fr) utt.voice = fr;
  };
  window.speechSynthesis.getVoices().length ? applyVoice() : (window.speechSynthesis.onvoiceschanged = applyVoice);

  utt.onstart = onStart;
  utt.onend   = onEnd;
  utt.onerror = () => { onError?.(); onEnd?.(); };
  window.speechSynthesis.speak(utt);
  return { type: "browser", utt };
}

export default function ChatArea({ chapter, onXPUpdate, showToast, user, onTalkingChange }) {
  const [messages, setMessages]     = useState([]);
  const [inputText, setInputText]   = useState("");
  const [isLoading, setIsLoading]   = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const chatRef        = useRef(null);
  const initializedRef = useRef(false);
  const currentAudio   = useRef(null); // {type:"gemini"|"browser", audio?}

  // Prénom garanti non-undefined
  const prenom = user?.prenom && user.prenom !== "undefined" ? user.prenom : "";

  const setTalking = useCallback(val => { onTalkingChange?.(val); }, [onTalkingChange]);

  // Scroll auto
  useEffect(() => {
    if (chatRef.current)
      setTimeout(() => { chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 80);
  }, [messages]);

  const appendMessage = useCallback(msg =>
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), ...msg }])
  , []);

  // Arrête la lecture en cours
  const stopCurrent = useCallback(() => {
    if (currentAudio.current?.type === "gemini") currentAudio.current.audio?.pause();
    window.speechSynthesis?.cancel();
    currentAudio.current = null;
    setSpeakingId(null);
    setTalking(false);
  }, [setTalking]);

  // Lance la lecture d'un message
  const playMessage = useCallback(async (msgId, text) => {
    if (speakingId === msgId) { stopCurrent(); return; }
    stopCurrent();
    setSpeakingId(msgId);
    setTalking(true);
    const handle = await speakText(text, {
      onStart: () => { setSpeakingId(msgId); setTalking(true); },
      onEnd:   () => { currentAudio.current = null; setSpeakingId(null); setTalking(false); },
      onError: () => { currentAudio.current = null; setSpeakingId(null); setTalking(false); },
    });
    currentAudio.current = handle;
  }, [speakingId, stopCurrent, setTalking]);

  // Appel IA
  const callAI = useCallback(async (text) => {
    setIsLoading(true);
    try {
      const data = await chatAPI.sendMessage(text, chapter);
      setIsLoading(false);
      const msgId = Date.now();
      appendMessage({ id: msgId, role: "bot", type: "text", content: data.reply });
      playMessage(msgId, data.reply);
    } catch (err) {
      setIsLoading(false);
      let msg = "⚠️ MathBot ne peut pas répondre pour le moment";
      if (err.message.includes("429") || err.message.includes("Limite"))
        msg = "⏱️ Limite atteinte — réessaie dans quelques secondes";
      else if (err.message.includes("401"))
        msg = "🔐 Session expirée, reconnecte-toi";
      appendMessage({ role: "bot", type: "text", content: msg });
    }
  }, [chapter, appendMessage, playMessage]);

  // Reconnaissance vocale
  const onVoiceResult = useCallback(transcript => {
    appendMessage({ role: "user", type: "text", content: transcript });
    callAI(transcript);
  }, [appendMessage, callAI]);

  const onVoiceError = useCallback(err => {
    showToast(`Micro : ${err === "not-allowed" ? "Autorise le micro dans le navigateur" : err}`);
  }, [showToast]);

  const { listening, start: startListening, stop: stopListening, supported: sttSupported } =
    useSpeechRecognition({ onResult: onVoiceResult, onError: onVoiceError });

  // Chargement initial — welcome via API dédiée
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    setMessages([]);
    (async () => {
      setIsLoading(true);
      try {
        const data = await chatAPI.getWelcome(chapter);
        setIsLoading(false);
        const msgId = Date.now();
        appendMessage({ id: msgId, role: "bot", type: "text", content: data.reply });
        playMessage(msgId, data.reply);
      } catch {
        setIsLoading(false);
        const msgId = Date.now();
        const fallback = prenom
          ? `Bonjour ${prenom} ! Je suis MathBot, ton tuteur de maths. Prêt à travailler "${chapter}" ensemble ? 😊`
          : `Bonjour ! Je suis MathBot, ton tuteur de maths. Prêt à travailler "${chapter}" ensemble ? 😊`;
        appendMessage({ id: msgId, role: "bot", type: "text", content: fallback });
      }
    })();
  }, [chapter]); // eslint-disable-line

  // Cleanup audio au unmount
  useEffect(() => () => stopCurrent(), [stopCurrent]);

  const sendMessage = async text => {
    const t = text.trim();
    if (!t || isLoading) return;
    stopCurrent();
    appendMessage({ role: "user", type: "text", content: t });
    setInputText("");
    await callAI(t);
  };

  const selectOption = async (msgId, optionLabel, isCorrect) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, answered: true } : m));
    appendMessage({ role: "user", type: "text", content: `Ma réponse : ${optionLabel}` });
    try {
      const r = await progressionAPI.logExercice(chapter, isCorrect);
      if (onXPUpdate) onXPUpdate(r.xp, r.niveau);
      showToast(r.message);
    } catch { showToast(isCorrect ? "+20 XP ! 🎉" : "+5 XP 💪"); }
    const prompt = isCorrect
      ? `${prenom || "Super"}, bonne réponse "${optionLabel}" ! Explique pourquoi pas-à-pas, puis propose un exercice plus difficile.`
      : `Réponse "${optionLabel}" incorrecte${prenom ? ` ${prenom}` : ""}. Explique l'erreur gentiment, donne la bonne réponse pas-à-pas et encourage à continuer.`;
    await callAI(prompt);
  };

  const handleKey = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(inputText); }
  };

  return (
    <div className="chat-area">
      <div className="chat-top">
        <div className="chat-bot-info">
          <div className="chat-bot-avatar">🦉</div>
          <div>
            <div className="chat-bot-name">MathBot</div>
            <div className="chat-bot-sub">Tuteur IA · BEPC Burkina Faso</div>
          </div>
        </div>
        <div className="chat-topic-tag">{chapter}</div>
      </div>

      <div className="chat-messages" ref={chatRef}>
        {messages.map(msg => (
          <MessageBubble
            key={msg.id} msg={msg}
            onSelectOption={selectOption}
            onSpeak={playMessage}
            speakingId={speakingId}
          />
        ))}
        {isLoading && <TypingIndicator />}
      </div>

      <div className="quick-row">
        {QUICK_ACTIONS.map(a => (
          <button key={a.label} className="quick-btn"
            onClick={() => sendMessage(a.text)}
            disabled={isLoading || listening}
          >{a.label}</button>
        ))}
      </div>

      <div className="input-row">
        {sttSupported && <VoiceButton listening={listening} onStart={startListening} onStop={stopListening} disabled={isLoading} />}
        <input
          className={`chat-input ${listening ? "listening" : ""}`}
          value={listening ? "🎙 En écoute..." : inputText}
          onChange={e => !listening && setInputText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Écris ta question à MathBot..."
          disabled={isLoading || listening}
          readOnly={listening}
        />
        <button className="send-btn"
          onClick={() => sendMessage(inputText)}
          disabled={isLoading || listening || !inputText.trim()}
        >↑</button>
      </div>

      {listening && (
        <div className="listening-banner">
          <span className="listening-dot" />MathBot t'écoute… parle maintenant
        </div>
      )}
    </div>
  );
}

// ── Parsing QCM ───────────────────────────────────────────────────────────────
function parseExercise(content) {
  const lines = content.split("\n").map(l => l.trim()).filter(Boolean);
  // Accepte A. B. C. D. et A) B) C) D) et A- B- etc.
  const reg = /^([ABCD])[.)•\-]\s+(.+)/i;
  const options = lines.filter(l => reg.test(l));
  if (options.length < 2) return null;
  // Cherche la bonne réponse : "✓ Bonne réponse : X" ou "Réponse : X" ou ligne avec ✓
  const correctLine = lines.find(l =>
    (l.includes("✓") && /[ABCD]/.test(l)) ||
    /bonne\s+r[ée]ponse\s*:?\s*[ABCD]/i.test(l) ||
    /r[ée]ponse\s+correcte\s*:?\s*[ABCD]/i.test(l)
  );
  const correctLetter = correctLine?.match(/[ABCD]/i)?.[0]?.toUpperCase() ?? null;
  return {
    options: options.map(opt => {
      const m = opt.match(reg);
      const letter = m?.[1]?.toUpperCase() || opt[0].toUpperCase();
      return { label: opt, letter, text: m?.[2] || opt.slice(2).trim(), correct: correctLetter === letter };
    }),
  };
}

function MessageBubble({ msg, onSelectOption, onSpeak, speakingId }) {
  const isSpeaking = speakingId === msg.id;
  if (msg.role === "user") {
    return <div className="msg-user"><div className="bubble-user">{msg.content}</div></div>;
  }
  if (msg.type === "text") {
    const exercise = !msg.answered ? parseExercise(msg.content) : null;
    const optReg = /^[ABCD][.)•\-]\s+/i;
    const textLines = msg.content.split("\n").map(l => l.trim()).filter(l => {
      if (!l) return false;
      if (!exercise) return true;
      // Masque les lignes d'options et la ligne "✓ Bonne réponse"
      if (optReg.test(l)) return false;
      if (/bonne\s+r[ée]ponse|r[ée]ponse\s+(correcte|attendue)|✓/i.test(l)) return false;
      return true;
    });

    return (
      <div className="msg-bot">
        <div className="bubble-bot">
          {textLines.map((line, i) => <span key={i}>{line}<br /></span>)}
          {exercise && !msg.answered && (
            <div className="chat-options">
              {exercise.options.map((opt, i) => (
                <button key={i} className="opt-btn"
                  onClick={() => onSelectOption(msg.id, opt.label, opt.correct)}
                >
                  <span className="opt-letter">{opt.letter}</span>
                  <span className="opt-text">{opt.text}</span>
                </button>
              ))}
            </div>
          )}
          <SpeakButton
            speaking={isSpeaking}
            onSpeak={() => onSpeak(msg.id, msg.content)}
            onStop={() => onSpeak(msg.id, msg.content)}
          />
        </div>
      </div>
    );
  }
  return null;
}

function TypingIndicator() {
  return (
    <div className="msg-bot">
      <div className="bubble-bot typing-bubble">
        <div className="typing-indicator">
          <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
          <span className="typing-text">MathBot réfléchit…</span>
        </div>
      </div>
    </div>
  );
}