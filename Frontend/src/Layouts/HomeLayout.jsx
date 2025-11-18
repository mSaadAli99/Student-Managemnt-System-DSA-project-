// layouts/HomeLayout.tsx
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
  {
    icon: <BookCopy className="h-16 w-16" />,
    label: "Classes",
    path: "/classes",
  },
  {
    icon: <Inbox className="h-16 w-16" />,
    label: "Pending Invites",
    path: "/pending-invites",
  },
  {
    icon: <LogOut className="h-16 w-16" />,
    label: "Log Out",
    path: "/logout",
    onClick: () => {
      localStorage.clear();
      window.location.reload();
    },
  },
];
const sidebarItemsTeacher = [
  {
    icon: <BookCopy className="h-16 w-16" />,
    label: "Classes",
    path: "/classes",
  },
  {
    icon: <LogOut className="h-16 w-16" />,
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
    if (user?.role === "TEACHER") {
      setSideBarItems(sidebarItemsTeacher);
    } else {
      setSideBarItems(sidebarItemsStudent);
    }
  }, [user]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const SidebarContent = ({ isMobile = false }) => (
    <div
      className={cn(
        "flex flex-col h-full bg-background border-r",
        !isMobile && !isCollapsed && "w-64",
        !isMobile && isCollapsed && "w-16"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {(!isCollapsed || isMobile) && (
          <h1 className="text-xl text-primary font-bold">CampusHub</h1>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 hover:bg-primary/20",
              isCollapsed && !isMobile && "justify-center px-2",
              location.pathname === item.path &&
                "bg-primary/15 text-black font-medium"
            )}
            onClick={() => {
              if (item.onClick) {
                item.onClick();
              } else {
                navigate(item.path);
              }

              if (isMobile) setMobileOpen(false);
            }}
          >
            {item.icon}
            {(!isCollapsed || isMobile) && (
              <span className="truncate">{item.label}</span>
            )}
          </Button>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t">
        <div
          className={cn(
            "flex items-center gap-3",
            isCollapsed && !isMobile && "justify-center"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-medium">
              U
            </span>
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="fixed top-4 left-4 z-40 h-8 w-8 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent isMobile />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300",
            isCollapsed ? "w-16" : "w-64"
          )}
        >
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 min-h-screen transition-all duration-300",
            "md:ml-0", // Mobile has no margin
            !isCollapsed ? "" : "md:ml-16"
          )}
        >
          {/* Mobile header spacer */}
          <div className="h-16 md:h-0" />

          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
