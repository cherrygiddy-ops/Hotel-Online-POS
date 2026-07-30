import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import {
  BarChart3, BookOpen, DollarSign, FileText, LayoutDashboard, LogOut, Users, Handshake, TrendingUp, Activity, Receipt
} from "lucide-react";

const adminLinks = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Revenue", url: "/admin/revenue", icon: DollarSign },
  { title: "Content", url: "/admin/content", icon: BookOpen },
  { title: "Publishers", url: "/admin/publishers", icon: Users },
  { title: "Usage", url: "/admin/usage", icon: Activity },
];

const partnerLinks = [
  { title: "Overview", url: "/partner", icon: LayoutDashboard },
  { title: "Revenue", url: "/partner/revenue", icon: TrendingUp },
  { title: "Content", url: "/partner/content", icon: BookOpen },
  { title: "Agreements", url: "/partner/agreements", icon: FileText },
];

const publisherLinks = [
  { title: "Dashboard", url: "/publisher", icon: LayoutDashboard },
  { title: "Content Analytics", url: "/contentAnalytics", icon: BookOpen },
  { title: "Revenue Breakdown", url: "/revenueBreakdown", icon: TrendingUp },
  { title: "Receipts", url: "/receipts", icon: Receipt },
];

const roleConfig = {
  admin: { links: adminLinks, label: "Admin Panel", title: "Super Admin" },
  partner: { links: partnerLinks, label: "Partner Panel", title: "Partner" },
  publisher: { links: publisherLinks, label: "Publisher Panel", title: "Publisher" },
};

function AppSidebar({ role }: { role: "admin" | "partner" | "publisher" }) {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { links } = roleConfig[role];

  const handleLogout = () => {
    sessionStorage.removeItem("loho-auth");
    sessionStorage.removeItem("loho-role");
    navigate(role === "admin" ? "/admin-login" : "/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className={`p-4 ${collapsed ? "px-2" : ""}`}>
          <div className="flex items-center gap-2">
            <div className="gradient-primary rounded-lg p-2">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && <span className="text-lg font-bold font-display text-sidebar-foreground">LoHo</span>}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>{roleConfig[role].label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
                <LogOut className="mr-2 h-4 w-4" />
                {!collapsed && <span>Log Out</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export function DashboardLayout({ children, role }: { children: ReactNode; role: "admin" | "partner" | "publisher" }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role={role} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border bg-card px-4">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-sm font-medium text-muted-foreground capitalize">
              {roleConfig[role].title} Dashboard
            </h2>
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
