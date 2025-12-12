import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useUser } from "./UsuarioContext";
import {
  fetchSucursales,
} from "../services/dashboardService";
import type { Sucursal } from "../models/Sucursal";

interface SucursalContextType {
  sucursales: Sucursal[];
  sucursalId: number | null;
  loading: boolean;
  setSucursalId: (id: number | null) => void;
}

const SucursalContext = createContext<SucursalContextType | undefined>(
  undefined
);

const STORAGE_KEY = "selectedSucursalId";

const readStoredSucursal = (): number | null => {
  const value = localStorage.getItem(STORAGE_KEY);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

export const SucursalProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalId, setSucursalIdState] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    return readStoredSucursal();
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.token) {
      setSucursales([]);
      setSucursalIdState(null);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    const storedId = readStoredSucursal();
    fetchSucursales()
      .then((lista) => {
        if (!isMounted) return;
        setSucursales(lista);
        setSucursalIdState((prev) => {
          if (prev && lista.some((s) => s.id === prev)) {
            return prev;
          }
          if (storedId && lista.some((s) => s.id === storedId)) {
            return storedId;
          }
          return lista[0]?.id ?? null;
        });
      })
      .catch(() => {
        if (!isMounted) return;
        setSucursales([]);
        setSucursalIdState(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user?.token]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sucursalId === null) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, sucursalId.toString());
  }, [sucursalId]);

  const contextValue = useMemo(
    () => ({
      sucursales,
      sucursalId,
      loading,
      setSucursalId: setSucursalIdState,
    }),
    [sucursales, sucursalId, loading]
  );

  return (
    <SucursalContext.Provider value={contextValue}>
      {children}
    </SucursalContext.Provider>
  );
};

export const useSucursal = () => {
  const context = useContext(SucursalContext);
  if (!context) {
    throw new Error("useSucursal debe vivir dentro de SucursalProvider");
  }
  return context;
};
