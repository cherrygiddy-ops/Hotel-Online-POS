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
  BookOpen,
  LayoutDashboard,
  LogOut,
  TrendingUp,
  Receipt,
} from "lucide-react";

const publisherLinks = [
  { title: "Dashboard", url: "/waiter", icon: LayoutDashboard },
  { title: "Manage Receipt", url: "/waiter/manage", icon:Receipt },
];

export function WaiterSideBar() {
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
          <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-sidebar-primary/20 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-sidebar-primary" />
          </div>
          <div>
            <h1 className="font-heading text-base font-semibold text-sidebar-accent-foreground">Steak</h1>
            <p className="text-xs text-sidebar-foreground">Waiter Dashboard</p>
          </div>
        </div>
      </div>

        <SidebarGroup>
          <SidebarGroupLabel>Waiter Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {publisherLinks.map((item) => (
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
              <div className="p-4 border-t border-sidebar-border">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="h-8 w-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sm font-semibold text-sidebar-primary">
                    ST
                  </div>
                  <div>
                    <p className="text-sm font-medium text-sidebar-accent-foreground">
                      Steak House Hotel POS
                    </p>
                    {/* <p className="text-xs text-sidebar-foreground">Waiter</p> */}
                  </div>
                </div>
              </div>

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
