import { useAuth } from "@/auth/AuthProvider";
import { Outlet, Navigate } from "react-router-dom";

export default function PublicRoute() {
  const { user, isLoading } = useAuth();

  // Espera a que termine la verificación de sesión
  if (isLoading) return null;

  // Si ya hay sesión activa, redirige al dashboard
  if (user) return <Navigate to="/dashboard" />;

  return <Outlet />;
}
