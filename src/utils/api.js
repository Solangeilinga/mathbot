// src/utils/api.js

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function apiFetch(endpoint, options = {}) {
  // Plus de token JWT — pas d'auth
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Erreur ${response.status}`);
  }
  return data;
}

// ─── Chat IA ──────────────────────────────────────────────────────────────────
export const chatAPI = {
  getWelcome: (chapitre) =>
    apiFetch(`/chat/welcome?chapitre=${encodeURIComponent(chapitre)}`),
  sendMessage: (message, chapitre) =>
    apiFetch("/chat/message", { method: "POST", body: JSON.stringify({ message, chapitre }) }),
  getHistory: (chapitre) =>
    apiFetch(`/chat/history/${encodeURIComponent(chapitre)}`),
  clearHistory: (chapitre) =>
    apiFetch(`/chat/history/${encodeURIComponent(chapitre)}`, { method: "DELETE" }),
};

// ─── Progression ──────────────────────────────────────────────────────────────
export const progressionAPI = {
  get: () => apiFetch("/progression"),
  logExercice: (chapitre, correct) =>
    apiFetch("/progression/exercice", { method: "POST", body: JSON.stringify({ chapitre, correct }) }),
  logSession: (chapitre, xpGagne, dureeSec) =>
    apiFetch("/progression/session", { method: "POST", body: JSON.stringify({ chapitre, xpGagne, dureeSec }) }),
  leaderboard: () => apiFetch("/progression/leaderboard"),
};

// ─── TTS ──────────────────────────────────────────────────────────────────────
export const ttsAPI = {
  synthesize: (text) =>
    apiFetch("/tts", { method: "POST", body: JSON.stringify({ text }) }),
};

// ─── Mémoire pédagogique ──────────────────────────────────────────────────────
export const memoryAPI = {
  get: () => apiFetch("/memory"),
  update: (chapitre) =>
    apiFetch("/memory/update", { method: "POST", body: JSON.stringify({ chapitre }) }),
};

// ─── Examen ───────────────────────────────────────────────────────────────────
export const examAPI = {
  logResults: (chapitre, score, total, temps) =>
    apiFetch("/exam/results", { method: "POST", body: JSON.stringify({ chapitre, score, total, temps }) }),
  getHistory: (chapitre) =>
    apiFetch(chapitre ? `/exam/history/${encodeURIComponent(chapitre)}` : "/exam/history"),
  getStats: (chapitre) =>
    apiFetch(`/exam/stats/${encodeURIComponent(chapitre)}`),
};

// ─── Sujets d'examen ──────────────────────────────────────────────────────────
export const subjectAPI = {
  getSessions: () => apiFetch("/subject/sessions"),
  getSubjectsBySession: (session) => apiFetch(`/subject/${encodeURIComponent(session)}`),
  getSubject: (session, chapitre) =>
    apiFetch(`/subject/${encodeURIComponent(session)}/${encodeURIComponent(chapitre)}`),
  correctSubject: (sujet, reponses) =>
    apiFetch("/subject/correct", { method: "POST", body: JSON.stringify({ sujet, reponses }) }),
};