import { useAuth } from "@/auth/AuthProvider";
import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoute() {
  const auth = useAuth();

  return auth.user ? <Outlet /> : <Navigate to="/" />;
}
