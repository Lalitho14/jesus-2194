import { useAuth } from "@/auth/AuthProvider";
import { Outlet, Navigate } from "react-router-dom";
import NavBar from "@/components/NavBar";

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  // Espera a que termine la verificación de sesión antes de decidir.
  // Sin esto, user=null durante la carga provoca una redirección prematura
  // que remonta el componente y dispara una segunda petición a /me.
  if (isLoading) return null; 

  if (!user) return <Navigate to="/" />;

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <Outlet />
    </div>
  );
}
