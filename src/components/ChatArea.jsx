import { useState, useRef, useEffect, useCallback } from "react";
import VoiceButton from "./VoiceButton";
import SpeakButton from "./SpeakButton";
import { chatAPI, progressionAPI } from "../utils/api";
import { useSpeechRecognition, useSpeechSynthesis } from "../hooks/useSpeech";

const QUICK_ACTIONS = [
  { label:"💡 Expliquer",       text:"Je ne comprends pas, explique autrement avec un exemple simple" },
  { label:"➡ Exercice suivant", text:"Donne-moi un nouvel exercice BEPC avec 4 options A B C D" },
  { label:"🎯 Indice",          text:"Donne-moi un indice sans donner la réponse" },
  { label:"📐 Formule",         text:"Rappelle-moi la formule principale de ce chapitre" },
];

export default function ChatArea({ chapter, onXPUpdate, showToast, user, onTalkingChange }) {
  const [messages, setMessages]     = useState([]);
  const [inputText, setInputText]   = useState("");
  const [isLoading, setIsLoading]   = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const chatRef = useRef(null);
  const initializedRef = useRef(false);

  const { speak, stopSpeaking } = useSpeechSynthesis();

  // Notifier OwlTutor quand MathBot parle
  const setTalking = useCallback((val) => {
    if (onTalkingChange) onTalkingChange(val);
  }, [onTalkingChange]);

  const handleSpeak = useCallback((msgId, text) => {
    if (speakingId===msgId) { stopSpeaking(); setSpeakingId(null); setTalking(false); }
    else {
      stopSpeaking(); setSpeakingId(msgId); setTalking(true);
      speak(text);
      const check = setInterval(() => {
        if (!window.speechSynthesis?.speaking) { setSpeakingId(null); setTalking(false); clearInterval(check); }
      }, 300);
    }
  }, [speakingId, speak, stopSpeaking, setTalking]);

  const onVoiceResult = useCallback((transcript) => {
    setInputText("");
    appendMessage({ role:"user", type:"text", content:transcript });
    callBackendAI(transcript);
  }, []); // eslint-disable-line

  const onVoiceError = useCallback((err) => {
    showToast(`Micro : ${err==="not-allowed"?"Autorise le micro":err}`);
  }, [showToast]);

  const { listening, start:startListening, stop:stopListening, supported:sttSupported } =
    useSpeechRecognition({ onResult:onVoiceResult, onError:onVoiceError });

  useEffect(() => {
    if (chatRef.current) setTimeout(() => { chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 100);
  }, [messages]);

  const appendMessage = (msg) =>
    setMessages(prev => [...prev, { id:Date.now()+Math.random(), ...msg }]);

  const callBackendAI = async (text) => {
    setIsLoading(true);
    try {
      const data = await chatAPI.sendMessage(text, chapter);
      setIsLoading(false);
      const msgId = Date.now();
      appendMessage({ id:msgId, role:"bot", type:"text", content:data.reply });
      setSpeakingId(msgId); setTalking(true);
      speak(data.reply);
      const check = setInterval(() => {
        if (!window.speechSynthesis?.speaking) { setSpeakingId(null); setTalking(false); clearInterval(check); }
      }, 300);
    } catch(err) {
      setIsLoading(false);
      let errorMsg = `⚠️ MathBot ne peut pas répondre pour le moment`;
      if (err.message.includes("Erreur IA")) {
        errorMsg += ` (API IA indisponible). Réessaie dans quelques secondes...`;
      } else if (err.message.includes("401")) {
        errorMsg = `🔐 Session expirée. Reconnecte-toi, s'il te plaît.`;
      } else if (err.message.includes("network")) {
        errorMsg = `🌐 Problème de connexion. Vérifie ta connexion internet.`;
      }
      appendMessage({ role:"bot", type:"text", content:errorMsg });
    }
  };

  // Premier message généré par l'IA au chargement
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    setMessages([]);
    const text = `Bonjour MathBot ! Je m'appelle ${user?.prenom||"élève"} et je veux réviser le chapitre ${chapter}. Génère-moi un exercice BEPC avec 4 options A, B, C, D pour commencer.`;
    appendMessage({ role:"user", type:"text", content:text });
    callBackendAI(text);
  }, [chapter]); // eslint-disable-line

  const sendMessage = async (text) => {
    const t = text.trim(); if (!t||isLoading) return;
    stopSpeaking(); setSpeakingId(null); setTalking(false);
    appendMessage({ role:"user", type:"text", content:t });
    setInputText("");
    await callBackendAI(t);
  };

  const selectOption = async (msgId, optionLabel, isCorrect) => {
    setMessages(prev => prev.map(m => m.id===msgId ? {...m, answered:true, selectedLabel:optionLabel} : m));
    appendMessage({ role:"user", type:"text", content:`J'ai répondu ${optionLabel}` });
    let xpGagne = isCorrect ? 20 : 5;
    try {
      const r = await progressionAPI.logExercice(chapter, isCorrect);
      xpGagne = r.xpGagne;
      if (onXPUpdate) onXPUpdate(r.xp, r.niveau);
      showToast(r.message);
    } catch { showToast(isCorrect?"+20 XP ! 🎉":"+5 XP 💪"); }
    const prompt = isCorrect
      ? `L'élève a répondu "${optionLabel}" — BONNE réponse ! Félicite-le et explique pourquoi c'est correct pas-à-pas. Puis propose un exercice plus difficile.`
      : `L'élève a répondu "${optionLabel}" — MAUVAISE réponse. Explique gentiment l'erreur, donne la bonne réponse et corrige pas-à-pas. Encourage-le à continuer.`;
    await callBackendAI(prompt);
  };

  const handleKey = (e) => { if (e.key==="Enter"&&!e.shiftKey) { e.preventDefault(); sendMessage(inputText); } };

  return (
    <div className="chat-area">
      <div className="chat-top">
        <div className="chat-bot-info">
          <div className="chat-bot-avatar">🦉</div>
          <div><div className="chat-bot-name">MathBot</div><div className="chat-bot-sub">Tuteur IA · BEPC Burkina Faso</div></div>
        </div>
        <div className="chat-topic-tag">{chapter}</div>
      </div>

      <div className="chat-messages" ref={chatRef}>
        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} onSelectOption={selectOption} onSpeak={handleSpeak} speakingId={speakingId} />
        ))}
        {isLoading && <TypingIndicator />}
      </div>

      <div className="quick-row">
        {QUICK_ACTIONS.map(a => (
          <button key={a.label} className="quick-btn" onClick={() => sendMessage(a.text)} disabled={isLoading||listening}>{a.label}</button>
        ))}
      </div>

      <div className="input-row">
        {sttSupported && <VoiceButton listening={listening} onStart={startListening} onStop={stopListening} disabled={isLoading}/>}
        <input className={`chat-input ${listening?"listening":""}`}
          value={listening?"🎙 En écoute...":inputText}
          onChange={e => !listening&&setInputText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Écris ou parle à MathBot..."
          disabled={isLoading||listening} readOnly={listening}
        />
        <button className="send-btn" onClick={() => sendMessage(inputText)} disabled={isLoading||listening||!inputText.trim()}>↑</button>
      </div>

      {listening && (
        <div className="listening-banner">
          <span className="listening-dot"/>MathBot t'écoute… parle maintenant
        </div>
      )}
    </div>
  );
}

function parseExercise(content) {
  const lines = content.split("\n").map(l=>l.trim()).filter(Boolean);
  const reg = /^[ABCD][.)]\s+.+/;
  const options = lines.filter(l=>reg.test(l));
  if (options.length < 2) return null;
  const correctLine = lines.find(l=>l.includes("✓")||l.toLowerCase().includes("bonne réponse"));
  const correctLetter = correctLine ? correctLine.match(/[ABCD]/)?.[0] : null;
  return { options: options.map(opt => ({ label:opt, letter:opt[0], correct: correctLetter ? opt[0]===correctLetter : false })) };
}

function MessageBubble({ msg, onSelectOption, onSpeak, speakingId }) {
  const isSpeaking = speakingId===msg.id;
  if (msg.role==="user") return <div className="msg-user"><div className="bubble-user">{msg.content}</div></div>;
  if (msg.type==="text") {
    const exercise = !msg.answered ? parseExercise(msg.content) : null;
    const reg = /^[ABCD][.)]\s+.+/;
    const textLines = exercise
      ? msg.content.split("\n").map(l=>l.trim()).filter(l=>!reg.test(l)&&!l.includes("✓"))
      : msg.content.split("\n").map(l=>l.trim()).filter(Boolean);
    return (
      <div className="msg-bot">
        <div className="bubble-bot">
          {textLines.map((line,i) => <span key={i}>{line}<br/></span>)}
          {exercise && !msg.answered && (
            <div className="chat-options">
              {exercise.options.map((opt,i) => (
                <button key={i} className="opt-btn" onClick={() => onSelectOption(msg.id, opt.label, opt.correct)}>{opt.label}</button>
              ))}
            </div>
          )}
          {onSpeak && <SpeakButton speaking={isSpeaking} onSpeak={()=>onSpeak(msg.id,msg.content)} onStop={()=>onSpeak(msg.id,msg.content)}/>}
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
          <span className="typing-dot"/><span className="typing-dot"/><span className="typing-dot"/>
        </div>
      </div>
    </div>
  );
}
