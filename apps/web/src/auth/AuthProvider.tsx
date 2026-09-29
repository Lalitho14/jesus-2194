import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@repo/types";
import { getUser } from "../services/auth.service";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  getUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getUserData = async () => {
    setIsLoading(true);

    try {
      const userData = await getUser();

      if (userData) setUser(null);
    } catch (error) {
      console.log("Error fetching user data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const authState = async () => {};

  useEffect(() => {
    authState();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, getUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  return context;
};
