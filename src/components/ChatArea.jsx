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

function playAudioBase64(base64, mimeType, { onStart, onEnd } = {}) {
  try {
    const bytes = atob(base64);
    const buf   = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) buf[i] = bytes.charCodeAt(i);
    const blob  = new Blob([buf], { type: mimeType || "audio/mpeg" });
    const url   = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onplay  = onStart;
    audio.onended = () => { URL.revokeObjectURL(url); onEnd?.(); };
    audio.onerror = () => { URL.revokeObjectURL(url); onEnd?.(); };
    audio.play().catch(() => { URL.revokeObjectURL(url); onEnd?.(); });
    return audio;
  } catch {
    onEnd?.();
    return null;
  }
}

export default function ChatArea({ chapter, onXPUpdate, showToast, user, onTalkingChange }) {
  const [messages, setMessages]     = useState([]);
  const [inputText, setInputText]   = useState("");
  const [isLoading, setIsLoading]   = useState(false);
  const [speakingId, setSpeakingId] = useState(null);

  const chatRef        = useRef(null);
  const initializedRef = useRef(false);
  // Ref pour la lecture en cours — jamais périmé dans les callbacks
  const playing = useRef(null); // { handle: Audio|null, msgId: number } | null
  // Ref pour setTalking — stable
  const onTalkingChangeRef = useRef(onTalkingChange);
  useEffect(() => { onTalkingChangeRef.current = onTalkingChange; }, [onTalkingChange]);

  const prenom = user?.prenom && user.prenom !== "undefined" ? user.prenom : "";

  const setTalking = useCallback(val => onTalkingChangeRef.current?.(val), []);

  // Scroll auto
  useEffect(() => {
    if (chatRef.current)
      setTimeout(() => { chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 80);
  }, [messages]);

  const appendMessage = useCallback(msg =>
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), ...msg }])
  , []);

  // ── Stop propre ───────────────────────────────────────────────────────────
  const stopAll = useCallback(() => {
    if (playing.current?.handle) {
      try { playing.current.handle.pause(); } catch {}
    }
    playing.current = null;
    setSpeakingId(null);
    setTalking(false);
  }, [setTalking]);

  // ── speakMessage — stable grâce aux refs ──────────────────────────────────
  // On utilise une ref pour la fonction elle-même afin qu'elle soit accessible
  // depuis callAI sans créer de dépendance circulaire
  const speakMessageRef = useRef(null);

  speakMessageRef.current = async (msgId, text) => {
    // Toggle
    if (playing.current?.msgId === msgId) {
      stopAll();
      return;
    }
    stopAll();

    // Marque immédiatement
    setSpeakingId(msgId);
    setTalking(true);

    try {
      const data = await ttsAPI.synthesize(text);

      // Vérifie qu'on n'a pas été supplanté
      // (si playing.current a changé, un autre message a pris le relais)
      if (playing.current !== null) return;

      const onEnd = () => {
        // Vérifie que c'est bien ce message qui finit
        if (playing.current?.msgId === msgId) {
          playing.current = null;
          setSpeakingId(null);
          setTalking(false);
        }
      };

      if (data.silent) {
        // Pas de voix disponible
        playing.current = null;
        setSpeakingId(null);
        setTalking(false);
        return;
      }

      if (data.audioContent) {
        const audio = playAudioBase64(data.audioContent, data.mimeType, {
          onStart: () => { setSpeakingId(msgId); setTalking(true); },
          onEnd,
        });
        if (audio) {
          playing.current = { handle: audio, msgId };
        } else {
          playing.current = null;
          setSpeakingId(null);
          setTalking(false);
        }
      } else {
        playing.current = null;
        setSpeakingId(null);
        setTalking(false);
      }
    } catch {
      playing.current = null;
      setSpeakingId(null);
      setTalking(false);
    }
  };

  // Wrapper stable exposé aux composants
  const speakMessage = useCallback((msgId, text) => {
    speakMessageRef.current(msgId, text);
  }, []);

  // ── Appel IA ──────────────────────────────────────────────────────────────
  const callAI = useCallback(async (text) => {
    setIsLoading(true);
    try {
      const data = await chatAPI.sendMessage(text, chapter);
      setIsLoading(false);
      const msgId = Date.now();
      // 1. Affiche le texte immédiatement
      appendMessage({ id: msgId, role: "bot", type: "text", content: data.reply });
      // 2. Lance la voix automatiquement
      speakMessageRef.current(msgId, data.reply);
    } catch (err) {
      setIsLoading(false);
      let msg = "⚠️ MathBot ne peut pas répondre pour le moment";
      if (err.message.includes("429") || err.message.includes("Limite"))
        msg = "⏱️ Limite atteinte — réessaie dans quelques secondes";
      appendMessage({ role: "bot", type: "text", content: msg });
    }
  }, [chapter, appendMessage]);

  // ── Voix entrée ───────────────────────────────────────────────────────────
  const onVoiceResult = useCallback(transcript => {
    appendMessage({ role: "user", type: "text", content: transcript });
    callAI(transcript);
  }, [appendMessage, callAI]);

  const onVoiceError = useCallback(err => {
    showToast(`Micro : ${err === "not-allowed" ? "Autorise le micro dans le navigateur" : err}`);
  }, [showToast]);

  const { listening, start: startListening, stop: stopListening, supported: sttSupported } =
    useSpeechRecognition({ onResult: onVoiceResult, onError: onVoiceError });

  // ── Bienvenue — s'exécute une seule fois par chapitre ─────────────────────
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
        // Voix auto sur le message de bienvenue
        speakMessageRef.current(msgId, data.reply);
      } catch {
        setIsLoading(false);
        const fallback = prenom
          ? `Bonjour ${prenom} ! Je suis MathBot, prêt à travailler "${chapter}" avec toi 😊`
          : `Bonjour ! Prêt à travailler "${chapter}" ensemble 😊`;
        appendMessage({ role: "bot", type: "text", content: fallback });
      }
    })();
  }, [chapter]); // eslint-disable-line — intentionnellement limité à chapter

  useEffect(() => () => stopAll(), [stopAll]);

  const sendMessage = async text => {
    const t = text.trim();
    if (!t || isLoading) return;
    stopAll();
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
      ? `${prenom ? prenom + ", b" : "B"}onne réponse "${optionLabel}" ! Explique pourquoi pas-à-pas, puis propose un exercice plus difficile.`
      : `Réponse "${optionLabel}" incorrecte${prenom ? " " + prenom : ""}. Explique gentiment l'erreur, donne la correction pas-à-pas et encourage.`;
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
            key={msg.id}
            msg={msg}
            onSelectOption={selectOption}
            onSpeak={speakMessage}
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
        {sttSupported && (
          <VoiceButton listening={listening} onStart={startListening} onStop={stopListening} disabled={isLoading} />
        )}
        <input
          className={`chat-input ${listening ? "listening" : ""}`}
          value={listening ? "🎙 En écoute..." : inputText}
          onChange={e => !listening && setInputText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Écris ta question à MathBot..."
          disabled={isLoading || listening}
          readOnly={listening}
        />
        <button
          className="send-btn"
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

function parseExercise(content) {
  const lines   = content.split("\n").map(l => l.trim()).filter(Boolean);
  const reg     = /^([ABCD])[.)•\-]\s+(.+)/i;
  const options = lines.filter(l => reg.test(l));
  if (options.length < 2) return null;
  const correctLine   = lines.find(l =>
    (l.includes("✓") && /[ABCD]/.test(l)) ||
    /bonne\s+r[ée]ponse\s*:?\s*[ABCD]/i.test(l)
  );
  const correctLetter = correctLine?.match(/[ABCD]/i)?.[0]?.toUpperCase() ?? null;
  return {
    options: options.map(opt => {
      const m      = opt.match(reg);
      const letter = m?.[1]?.toUpperCase() || opt[0].toUpperCase();
      return { label: opt, letter, text: m?.[2] || opt.slice(2).trim(), correct: correctLetter === letter };
    }),
  };
}

function MessageBubble({ msg, onSelectOption, onSpeak, speakingId }) {
  const isSpeaking = speakingId === msg.id;
  if (msg.role === "user")
    return <div className="msg-user"><div className="bubble-user">{msg.content}</div></div>;

  if (msg.type === "text") {
    const exercise  = !msg.answered ? parseExercise(msg.content) : null;
    const optReg    = /^[ABCD][.)•\-]\s+/i;
    const textLines = msg.content.split("\n").map(l => l.trim()).filter(l => {
      if (!l) return false;
      if (!exercise) return true;
      if (optReg.test(l)) return false;
      if (/bonne\s+r[ée]ponse|✓/i.test(l)) return false;
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
      <div className="bubble-bot">
        <div className="typing-indicator">
          <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
          <span className="typing-text">MathBot réfléchit…</span>
        </div>
      </div>
    </div>
  );
}