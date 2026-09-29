import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@repo/types";
import {
  getUser,
  login as loginService,
  logout as logoutService,
} from "../services/auth.service";
import type { loginData } from "@repo/validation";
import { registerSessionExpiredCallback } from "@/lib/fetchWithAuth";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  getUserData: () => Promise<void>;
  login: (data: loginData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getUserData = async () => {
    setIsLoading(true);

    try {
      const userData = await getUser();

      if (userData) setUser(userData.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // «Middleware»: verifica la sesión activa al montar la app
  // Si el servidor devuelve el user (cookie/token válida) lo guarda en estado.
  // Si no, user queda null y ProtectedRoute redirige al login.
  const authState = async () => {
    await getUserData();
  };

  const login = async (data: loginData) => {
    await loginService(data);
    await getUserData(); // inicializa el user en el contexto tras el login
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
  };

  useEffect(() => {
    // Registra el callback ANTES de la primera petición.
    // Si refresh_token falla (401), fetchWithAuth llama esto → limpia el user
    // → ProtectedRoute redirige a "/" automáticamente.
    registerSessionExpiredCallback(() => setUser(null));
    authState();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, getUserData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  return context;
};
