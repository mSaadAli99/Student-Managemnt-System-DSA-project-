import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BookCopy,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItemsStudent = [
  { icon: <BookCopy className="h-5 w-5" />, label: "Classes", path: "/classes" },
  { icon: <Inbox className="h-5 w-5" />, label: "Pending Invites", path: "/pending-invites" },
  {
    icon: <LogOut className="h-5 w-5" />,
    label: "Log Out",
    path: "/logout",
    onClick: () => {
      localStorage.clear();
      window.location.reload();
    },
  },
];
const sidebarItemsTeacher = [
  { icon: <BookCopy className="h-5 w-5" />, label: "Classes", path: "/classes" },
  {
    icon: <LogOut className="h-5 w-5" />,
    label: "Log Out",
    path: "/logout",
    onClick: () => {
      localStorage.clear();
      window.location.reload();
    },
  },
];

export default function HomeLayout() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarItems, setSideBarItems] = useState([]);

  useEffect(() => {
    if (user?.role === "TEACHER") setSideBarItems(sidebarItemsTeacher);
    else setSideBarItems(sidebarItemsStudent);
  }, [user]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const SidebarContent = ({ isMobile = false }) => (
    <div
      className={cn(
        "dashboard-sidebar",
        !isMobile && isCollapsed && "dashboard-sidebar--collapsed"
      )}
    >
      <div className="dashboard-sidebar__header">
        {(!isCollapsed || isMobile) && <h1>CampusHub</h1>}
        {!isMobile && (
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="toggle-btn">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <nav className="dashboard-sidebar__nav">
        {sidebarItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={cn(
              "nav-pill",
              location.pathname === item.path && "nav-pill--active",
              isCollapsed && !isMobile && "nav-pill--compact"
            )}
            onClick={() => {
              if (item.onClick) item.onClick();
              else navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
          >
            {item.icon}
            {(!isCollapsed || isMobile) && <span>{item.label}</span>}
          </Button>
        ))}
      </nav>

      <div className="dashboard-sidebar__user">
        <div className="avatar">{user?.name?.[0] ?? "U"}</div>
        {(!isCollapsed || isMobile) && (
          <div className="user-copy">
            <p>{user?.name}</p>
            <small>{user?.email}</small>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard-hero">
      <span className="login-disc login-disc--one" />
      <span className="login-disc login-disc--two" />
      <span className="login-disc login-disc--three" />

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="mobile-trigger">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-slate-900 text-white">
            <SidebarContent isMobile />
          </SheetContent>
        </Sheet>
      </div>

      <div className="dashboard-shell">
        <aside className={cn("hidden md:flex", isCollapsed && "w-[80px]")}>
          <SidebarContent />
        </aside>

        <main className="dashboard-main">
          <header className="dashboard-main__header">
            <div>
              <p className="eyebrow">Welcome back</p>
              <h2>{user?.name ?? "CampusHub member"}</h2>
              <p>Manage your classes and invites in one organized space.</p>
            </div>
          </header>

          <section className="dashboard-main__content">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}