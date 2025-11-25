import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "../models/Usuario";
import { useNavigate } from "react-router-dom";

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

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
    setUserState(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setUserState(null);
  };

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
