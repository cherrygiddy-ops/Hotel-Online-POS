import { Navigate, Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PublisherSidebar } from "@/components/PublisherSidebar";
import { PartnerSidebar } from "@/components/PartnerSidebar";

export default function PrivateRoutes() {
  const isAuthenticated = sessionStorage.getItem("loho-auth") === "true";
  const role = sessionStorage.getItem("loho-role") || "publisher";
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Determine which sidebar to show based on current path
  const isPartnerRoute = location.pathname.startsWith("/partner");
  const showPartnerSidebar = role === "partner" || isPartnerRoute;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {showPartnerSidebar ? <PartnerSidebar /> : <PublisherSidebar />}
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border bg-card px-4">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-sm font-medium text-muted-foreground capitalize">
              {showPartnerSidebar ? "Partner" : "Publisher"} Dashboard
            </h2>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
