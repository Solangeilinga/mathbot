// src/hooks/useAuth.js — Gestion de l'authentification JWT côté frontend
import { useState, useCallback } from "react";
import { authAPI } from "../utils/api";

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("bepc_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const data = await authAPI.login(email, password);
      localStorage.setItem("bepc_token", data.token);
      localStorage.setItem("bepc_user", JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (err) {
      setAuthError(err.message);
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const register = useCallback(async (nom, prenom, email, password) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const data = await authAPI.register(nom, prenom, email, password);
      localStorage.setItem("bepc_token", data.token);
      localStorage.setItem("bepc_user", JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (err) {
      setAuthError(err.message);
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("bepc_token");
    localStorage.removeItem("bepc_user");
    setUser(null);
  }, []);

  const updateXP = useCallback((newXP, newNiveau) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, xp: newXP, niveau: newNiveau ?? prev.niveau };
      localStorage.setItem("bepc_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { user, authError, authLoading, login, register, logout, updateXP };
}
