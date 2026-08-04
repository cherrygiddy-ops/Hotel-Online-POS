import { Navigate, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuthStore } from "@/Store/AuthStore";
import { WaiterSideBar } from "@/components/Waiter/WaiterSideBar";

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


export function WaiterPrivateRoutes() {
  const accessToken = useAuthStore(state => state.accessToken);
  if (!accessToken) return <Navigate to="/" replace />;
  return <DashboardShell sidebar={<WaiterSideBar />} title="Waiter Dashboard" />;
}
export function AdminPrivateRoutes() {
  const accessToken = useAuthStore(state => state.accessToken);
  if (!accessToken) return <Navigate to="/" replace />;
  return <DashboardShell sidebar={<AdminSidebar />} title="Admin Dashboard" />;
}
