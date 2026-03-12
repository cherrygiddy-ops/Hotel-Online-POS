import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoutes() {
  const isAuthenticated = sessionStorage.getItem("loho-auth") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
