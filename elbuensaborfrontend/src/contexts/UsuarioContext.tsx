import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import type { User } from "../models/Usuario";

interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const INACTIVITY_LIMIT_MINUTES = 45; // podés ajustar esto

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User | null>(() => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        const role = localStorage.getItem("role");
        const userId = localStorage.getItem("userId");

        return token && username && role && userId
            ? { token, username, role, userId }
            : null;
    });

    const setUser = (user: User) => {
        localStorage.setItem("token", user.token);
        localStorage.setItem("username", user.username);
        localStorage.setItem("role", user.role);
        localStorage.setItem("userId", user.userId.toString());
        localStorage.setItem("lastActivity", Date.now().toString());
        setUserState(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("lastActivity");
        setUserState(null);
    };

    useEffect(() => {
        if (!user) return;

        const updateActivity = () => {
            localStorage.setItem("lastActivity", Date.now().toString());
        };

        const checkInactivity = () => {
            const last = Number(localStorage.getItem("lastActivity") || Date.now());
            const diffMs = Date.now() - last;
            const limitMs = INACTIVITY_LIMIT_MINUTES * 60 * 1000;

            if (diffMs > limitMs) {
                logout();
            }
        };

        const events = ["click", "keydown", "mousemove", "scroll"];
        events.forEach((ev) => window.addEventListener(ev, updateActivity));

        // set inicial
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
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be inside UserProvider");
    return context;
};
