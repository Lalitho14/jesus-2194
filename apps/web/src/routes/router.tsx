import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/LoginPage";
import Signup from "../pages/auth/RegisterPage";
import Dashboard from "../pages/dashboard/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <Signup />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);
