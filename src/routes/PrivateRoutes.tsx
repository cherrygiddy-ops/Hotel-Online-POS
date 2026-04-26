import { Navigate, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PublisherSidebar } from "@/components/PublisherSidebar";
import { PartnerSidebar } from "@/components/PartnerSidebar";
import { AdminSidebar } from "@/components/AdminSidebar";

function DashboardShell({ sidebar, title }: { sidebar: React.ReactNode; title: string }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {sidebar}
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border bg-card px-4">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function PublisherPrivateRoutes() {
  const token = sessionStorage.getItem("loho-token");
  if (!token) return <Navigate to="/" replace />;
  return <DashboardShell sidebar={<PublisherSidebar />} title="Publisher Dashboard" />;
}

export function PartnerPrivateRoutes() {
  const token = sessionStorage.getItem("loho-token");
  if (!token) return <Navigate to="/" replace />;
  return <DashboardShell sidebar={<PartnerSidebar />} title="Partner Dashboard" />;
}

export function AdminPrivateRoutes() {
  const token = sessionStorage.getItem("loho-token");
  if (!token) return <Navigate to="/admin-login" replace />;
  return <DashboardShell sidebar={<AdminSidebar />} title="Admin Dashboard" />;
}
