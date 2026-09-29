import { useAuth } from "@/auth/AuthProvider";
import { Outlet, Navigate } from "react-router-dom";
import NavBar from "@/components/NavBar";

export default function ProtectedRoute() {
  const auth = useAuth();

  if (!auth.user) return <Navigate to="/" />;

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <Outlet />
    </div>
  );
}
