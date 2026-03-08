import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import type {User} from "../models/Usuario";

interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const INACTIVITY_LIMIT_MINUTES = 45;
const USER_STORAGE_KEYS = [
    "token",
    "username",
    "role",
    "subRole",
    "userId",
    "mustChangePassword",
    "fotoPerfil",
    "sucursalId",
    "lastActivity",
] as const;

const clearUserStorage = () => {
    USER_STORAGE_KEYS.forEach((key) => {
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
    });
};

export const UserProvider = ({children}: { children: ReactNode }) => {
    const [user, setUserState] = useState<User | null>(() => {
        const getStoredItem = (key: string) =>
            sessionStorage.getItem(key) ?? localStorage.getItem(key);

        const token = getStoredItem("token");
        const username = getStoredItem("username");
        const role = getStoredItem("role");
        const subRole = getStoredItem("subRole");
        const userId = getStoredItem("userId");
        const sucursalIdRaw = getStoredItem("sucursalId");
        const mustChangePasswordStr = getStoredItem("mustChangePassword");
        const fotoPerfil = getStoredItem("fotoPerfil");
        const lastActivityStr = getStoredItem("lastActivity");
        // si no hay datos básicos, no hay sesión
        if (!token || !username || !role || !userId) {
            return null;
        }

        // chequeo expiración por inactividad incluso al iniciar la app
        if (lastActivityStr) {
            const last = Number(lastActivityStr);
            const diffMs = Date.now() - last;
            const limitMs = INACTIVITY_LIMIT_MINUTES * 60 * 1000;

            if (diffMs > limitMs) {
                clearUserStorage();
                return null;
            }
        }

        USER_STORAGE_KEYS.forEach((key) => {
            const value = getStoredItem(key);
            if (value !== null) {
                sessionStorage.setItem(key, value);
            }
        });

        return {
            token,
            username,
            role,
            subRole,
            userId,
            mustChangePassword: mustChangePasswordStr === "true",
            sucursalId: sucursalIdRaw ? Number(sucursalIdRaw) : null,
            fotoPerfil: fotoPerfil ?? null,
        };
    });

    const setUser = (user: User) => {
        sessionStorage.setItem("token", user.token);
        localStorage.setItem("token", user.token);
        sessionStorage.setItem("username", user.username);
        localStorage.setItem("username", user.username);
        sessionStorage.setItem("role", user.role);
        localStorage.setItem("role", user.role);
        if (user.subRole) {
            sessionStorage.setItem("subRole", user.subRole);
            localStorage.setItem("subRole", user.subRole);
        } else {
            sessionStorage.removeItem("subRole");
            localStorage.removeItem("subRole");
        }
        sessionStorage.setItem("userId", user.userId.toString());
        localStorage.setItem("userId", user.userId.toString());
        sessionStorage.setItem(
            "mustChangePassword",
            user.mustChangePassword ? "true" : "false"
        );
        localStorage.setItem(
            "mustChangePassword",
            user.mustChangePassword ? "true" : "false"
        );
        if (user.fotoPerfil) {
            sessionStorage.setItem("fotoPerfil", user.fotoPerfil);
            localStorage.setItem("fotoPerfil", user.fotoPerfil);
        } else {
            sessionStorage.removeItem("fotoPerfil");
            localStorage.removeItem("fotoPerfil");
        }
        if (user.sucursalId !== undefined && user.sucursalId !== null) {
            sessionStorage.setItem("sucursalId", user.sucursalId.toString());
            localStorage.setItem("sucursalId", user.sucursalId.toString());
        } else {
            sessionStorage.removeItem("sucursalId");
            localStorage.removeItem("sucursalId");
        }
        sessionStorage.setItem("lastActivity", Date.now().toString());
        localStorage.setItem("lastActivity", Date.now().toString());
        setUserState(user);
    };

    const logout = () => {
        clearUserStorage();
        setUserState(null);
        window.location.assign("/");
    };

    useEffect(() => {
        if (!user) return;

        const updateActivity = () => {
            sessionStorage.setItem("lastActivity", Date.now().toString());
            localStorage.setItem("lastActivity", Date.now().toString());
        };

        const checkInactivity = () => {
            const last = Number(sessionStorage.getItem("lastActivity") || Date.now());
            const diffMs = Date.now() - last;
            const limitMs = INACTIVITY_LIMIT_MINUTES * 60 * 1000;

            if (diffMs > limitMs) {
                logout();
            }
        };

        const events = ["click", "keydown", "mousemove", "scroll"];
        events.forEach((ev) => window.addEventListener(ev, updateActivity));

        // set inicial de actividad
        updateActivity();

        const intervalId = window.setInterval(checkInactivity, 60 * 1000);

        return () => {
            events.forEach((ev) =>
                window.removeEventListener(ev, updateActivity)
            );
            window.clearInterval(intervalId);
        };
    }, [user]);

    return (
        <UserContext.Provider value={{user, setUser, logout}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be inside UserProvider");
    return context;
};
