import { createBrowserRouter } from "react-router-dom";
import Layout from "@/pages/Layout";
import ErrorPage from "@/pages/ErrorPage";
import Login from "@/components/auth/Login";
import AdminLogin from "@/components/auth/AdminLogin";
import PublisherDashboard from "@/components/publisher/PublisherDashboard";
import PublisherContent from "@/components/publisher/PublisherContent";
import PublisherReceipts from "@/components/publisher/PublisherReceipts";
import PublisherRevenue from "@/components/publisher/PublisherRevenue";
import PartnerOverview from "@/components/partner/PartnerOverview";
import PartnerRevenue from "@/components/partner/PartnerRevenue";
import PartnerContent from "@/components/partner/PartnerContent";
import PartnerAgreements from "@/components/partner/PartnerAgreements";
import { PublisherPrivateRoutes, PartnerPrivateRoutes, AdminPrivateRoutes } from "./PrivateRoutes";
import AdminDashboard from "@/components/admin/AdminOrderDashboard";
import CashierDashboard from "@/components/admin/CashierDashboard";
import AdminOrderDashboard from "@/components/admin/AdminOrderDashboard";
import AdminAnalyticsDashboard from "@/components/admin/AdminAnalyticsDashboard";
import AdminProductsPage from "@/components/admin/AdminProductsPage";

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
    element: <PublisherPrivateRoutes />,
    errorElement: <ErrorPage />,
    children: [
      { path: "publisher", element: <PublisherDashboard /> },
      { path: "contentAnalytics", element: <PublisherContent /> },
      { path: "receipts", element: <PublisherReceipts /> },
      { path: "revenueBreakdown", element: <PublisherRevenue /> },
    ],
  },
  {
    element: <PartnerPrivateRoutes />,
    errorElement: <ErrorPage />,
    children: [
      { path: "partner", element: <PartnerOverview /> },
      { path: "partner/revenue", element: <PartnerRevenue /> },
      { path: "partner/content", element: <PartnerContent /> },
      { path: "partner/agreements", element: <PartnerAgreements /> },
    ],
  },
  {
    element: <AdminPrivateRoutes />,
    errorElement: <ErrorPage />,
    children: [
      {path:"adminHome",element:<CashierDashboard/>},
      { path: "admin/orders", element: <AdminOrderDashboard /> },
      { path: "admin/analytics", element: <AdminAnalyticsDashboard /> },
      { path: "admin/inventory", element: <AdminProductsPage /> },
    ],
  },
]);

export default router;
