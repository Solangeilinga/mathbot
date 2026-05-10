// src/utils/api.js — Service centralisé d'appels au backend

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// ─── Helper fetch avec token JWT ─────────────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("bepc_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    // Si token expiré → déconnecter
    if (response.status === 401) {
      localStorage.removeItem("bepc_token");
      localStorage.removeItem("bepc_user");
      window.location.reload();
    }
    throw new Error(data.error || `Erreur ${response.status}`);
  }

  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (nom, prenom, email, password) =>
    apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ nom, prenom, email, password }),
    }),

  login: (email, password) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => apiFetch("/auth/me"),
};

// ─── Chat IA ──────────────────────────────────────────────────────────────────
export const chatAPI = {
  sendMessage: (message, chapitre) =>
    apiFetch("/chat/message", {
      method: "POST",
      body: JSON.stringify({ message, chapitre }),
    }),

  getHistory: (chapitre) =>
    apiFetch(`/chat/history/${encodeURIComponent(chapitre)}`),

  clearHistory: (chapitre) =>
    apiFetch(`/chat/history/${encodeURIComponent(chapitre)}`, {
      method: "DELETE",
    }),
};

// ─── Progression ──────────────────────────────────────────────────────────────
export const progressionAPI = {
  get: () => apiFetch("/progression"),

  logExercice: (chapitre, correct) =>
    apiFetch("/progression/exercice", {
      method: "POST",
      body: JSON.stringify({ chapitre, correct }),
    }),

  logSession: (chapitre, xpGagne, dureeSec) =>
    apiFetch("/progression/session", {
      method: "POST",
      body: JSON.stringify({ chapitre, xpGagne, dureeSec }),
    }),

  leaderboard: () => apiFetch("/progression/leaderboard"),
};

// ─── TTS — Voix réaliste Google Neural2 ──────────────────────────────────────
export const ttsAPI = {
  synthesize: (text) =>
    apiFetch("/tts", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
};

// ─── Mémoire pédagogique ──────────────────────────────────────────────────────
export const memoryAPI = {
  get: () => apiFetch("/memory"),
  update: (chapitre) =>
    apiFetch("/memory/update", {
      method: "POST",
      body: JSON.stringify({ chapitre }),
    }),
};

// ─── Examen blanc ──────────────────────────────────────────────────────────────
export const examAPI = {
  logResults: (chapitre, score, total, temps) =>
    apiFetch("/exam/results", {
      method: "POST",
      body: JSON.stringify({ chapitre, score, total, temps }),
    }),

  getHistory: (chapitre) =>
    apiFetch(
      chapitre
        ? `/exam/history/${encodeURIComponent(chapitre)}`
        : "/exam/history"
    ),

  getStats: (chapitre) =>
    apiFetch(`/exam/stats/${encodeURIComponent(chapitre)}`),
};

// ─── Sujets d'examen ────────────────────────────────────────────────────────────
export const subjectAPI = {
  getSessions: () =>
    apiFetch("/subject/sessions"),

  getSubjectsBySession: (session) =>
    apiFetch(`/subject/${encodeURIComponent(session)}`),

  getSubject: (session, chapitre) =>
    apiFetch(`/subject/${encodeURIComponent(session)}/${encodeURIComponent(chapitre)}`),

  correctSubject: (sujet, reponses) =>
    apiFetch("/subject/correct", {
      method: "POST",
      body: JSON.stringify({ sujet, reponses }),
    }),
};
