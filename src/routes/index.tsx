import { createBrowserRouter } from "react-router-dom";
import Layout from "@/pages/Layout";
import ErrorPage from "@/pages/ErrorPage";
import Login from "@/components/auth/Login";
import AdminLogin from "@/components/auth/AdminLogin";
import {
  AdminPrivateRoutes,
  WaiterPrivateRoutes,
} from "./PrivateRoutes";
import CashierDashboard from "@/components/admin/CashierDashboard";
import AdminOrderDashboard from "@/components/admin/AdminOrderDashboard";
import AdminAnalyticsDashboard from "@/components/admin/AdminAnalyticsDashboard";
import AdminProductsPage from "@/components/admin/AdminProductsPage";
import WaiterDashboard from "@/components/Waiter/WaiterDashboard";
import CategoriesCrud from "@/components/admin/CategoriesCrud";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Login /> },
      { path: "admin-login", element: <AdminLogin /> },
    ],
  },
  {
    element: <AdminPrivateRoutes />,
    errorElement: <ErrorPage />,
    children: [
      { path: "adminHome", element: <CashierDashboard /> },
      { path: "admin/orders", element: <AdminOrderDashboard /> },
      { path: "admin/analytics", element: <AdminAnalyticsDashboard /> },
      { path: "admin/inventory", element: <AdminProductsPage /> },
      { path: "admin/categories", element: <CategoriesCrud /> },
    ],
  },
  {
    element: <WaiterPrivateRoutes />,
    errorElement: <ErrorPage />,
    children: [
      { path: "waiter", element: <WaiterDashboard /> },
    ],
  },
]);

export default router;
