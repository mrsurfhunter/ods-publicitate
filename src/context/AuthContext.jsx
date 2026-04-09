import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { gid, sld, ssv } from "../utils/storage";
import { postLead } from "../utils/leads";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    sld("ods-user", null).then(u => { setUser(u); setReady(true); });
  }, []);

  const register = useCallback(async (data) => {
    const u = { id: gid(), ...data, createdAt: new Date().toISOString() };
    setUser(u);
    await ssv("ods-user", u);
    postLead(u);
    return u;
  }, []);

  const updateUser = useCallback(async (changes) => {
    const updated = { ...user, ...changes };
    setUser(updated);
    await ssv("ods-user", updated);
    postLead(updated);
  }, [user]);

  const login = useCallback(async (email) => {
    const stored = await sld("ods-user", null);
    if (stored && stored.email === email) {
      setUser(stored);
      return stored;
    }
    return null;
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await ssv("ods-user", null);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, isAuthenticated: !!user, ready, register, updateUser, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
