import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Users,
  Settings,
  ClipboardList,
  CreditCard,
  Package,
  Tags,
  Receipt,
} from "lucide-react";

const adminLinks = [
  { title: "Dashboard", url: "/adminHome", icon: LayoutDashboard },
  { title: "Manage Receipts", url: "/admin/managereceipt", icon: Receipt },
  { title: "Inventory", url: "/admin/inventory", icon: Package },
  { title: "Categories", url: "/admin/categories", icon: Tags },
  { title: "Payments", url: "/admin/payments", icon: CreditCard },
  { title: "Debtors", url: "/admin/debtors", icon: ClipboardList }, 
  { title: "Staff", url: "/admin/staff", icon: Users },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];


export function AdminSidebar() {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const handleLogout = () => {
    sessionStorage.removeItem("loho-auth");
    sessionStorage.removeItem("loho-role");
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className={`p-4 ${collapsed ? "px-2" : ""}`}>
          <div className="flex items-center gap-2">
            <div className="gradient-primary rounded-lg p-2">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold font-display text-sidebar-foreground">
                Steak Hotel POS
              </span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
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
              <SidebarMenuButton
                onClick={handleLogout}
                className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
              >
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
