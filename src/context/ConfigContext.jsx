import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { DEFAULT_PKG, DEFAULT_ADDONS } from "../data/packages";

const ConfigCtx = createContext(null);

export function ConfigProvider({ children }) {
  const [packages, setPackages] = useState(DEFAULT_PKG);
  const [addons, setAddons] = useState(DEFAULT_ADDONS);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    try {
      const r = await fetch("/api/config");
      if (!r.ok) throw new Error(r.status);
      const data = await r.json();
      if (data.packages?.length) setPackages(data.packages);
      if (data.addons?.length) setAddons(data.addons);
      setPromotions(data.promotions || []);
    } catch {
      // keep defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  return (
    <ConfigCtx.Provider value={{ packages, addons, promotions, loading, refetch: fetchConfig }}>
      {children}
    </ConfigCtx.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigCtx);
  if (!ctx) throw new Error("useConfig must be inside ConfigProvider");
  return ctx;
}
