import React, { createContext, useContext, useMemo, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  async function login(email, password, role) {
    const response = await api.post("/auth/login", { email, password, role });
    const { token: newToken, user: loggedUser } = response.data;
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    setToken(newToken);
    setUser(loggedUser);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ token, user, isAuthenticated: Boolean(token), login, logout }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}