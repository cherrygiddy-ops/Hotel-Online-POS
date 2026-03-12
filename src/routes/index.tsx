import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout";
import { PublisherPrivateRoutes, PartnerPrivateRoutes, AdminPrivateRoutes } from "./PrivateRoutes";
import ErrorPage from "@/pages/ErrorPage";
import Login from "@/pages/Login";
import AdminLogin from "@/pages/AdminLogin";
import PublisherDashboard from "@/pages/publisher/PublisherDashboard";
import PublisherContent from "@/pages/publisher/PublisherContent";
import PublisherReceipts from "@/pages/publisher/PublisherReceipts";
import PublisherRevenue from "@/pages/publisher/PublisherRevenue";
import PartnerOverview from "@/pages/partner/PartnerOverview";
import PartnerRevenue from "@/pages/partner/PartnerRevenue";
import PartnerContent from "@/pages/partner/PartnerContent";
import PartnerAgreements from "@/pages/partner/PartnerAgreements";
import AdminOverview from "@/pages/admin/AdminOverview";
import AdminRevenueView from "@/pages/admin/AdminRevenue";
import AdminContentView from "@/pages/admin/AdminContent";
import AdminPublishers from "@/pages/admin/AdminPublishers";
import AdminUsage from "@/pages/admin/AdminUsage";

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
      { path: "admin", element: <AdminOverview /> },
      { path: "admin/revenue", element: <AdminRevenueView /> },
      { path: "admin/content", element: <AdminContentView /> },
      { path: "admin/publishers", element: <AdminPublishers /> },
      { path: "admin/usage", element: <AdminUsage /> },
    ],
  },
]);

export default router;
