import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "./pages/Login";
import PartnerLogin from "./pages/PartnerLogin";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminRevenue from "./pages/admin/AdminRevenue";
import AdminContent from "./pages/admin/AdminContent";
import AdminPublishers from "./pages/admin/AdminPublishers";
import AdminUsage from "./pages/admin/AdminUsage";
import PartnerOverview from "./pages/partner/PartnerOverview";
import PartnerRevenue from "./pages/partner/PartnerRevenue";
import PartnerContent from "./pages/partner/PartnerContent";
import PartnerAgreements from "./pages/partner/PartnerAgreements";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          {/* Admin routes */}
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/revenue" element={<AdminRevenue />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/publishers" element={<AdminPublishers />} />
          <Route path="/admin/usage" element={<AdminUsage />} />
          {/* Partner routes */}
          <Route path="/partner" element={<PartnerOverview />} />
          <Route path="/partner/revenue" element={<PartnerRevenue />} />
          <Route path="/partner/content" element={<PartnerContent />} />
          <Route path="/partner/agreements" element={<PartnerAgreements />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
