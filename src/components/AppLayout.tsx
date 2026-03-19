import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Globe,
  Mail,
  GraduationCap,
  BarChart3,
  Settings,
  Bell,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "URL Scanner", href: "/scanner", icon: Globe },
  { title: "Email Analyzer", href: "/email", icon: Mail },
  { title: "Awareness Quiz", href: "/quiz", icon: GraduationCap },
  { title: "Reports", href: "/reports", icon: BarChart3 },
  { title: "Settings", href: "/settings", icon: Settings },
];

const SidebarItem = ({
  icon: Icon,
  label,
  href,
  active,
}: {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
  active: boolean;
}) => (
  <Link
    to={href}
    className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 border-r-2 text-sm font-medium ${
      active
        ? "bg-primary/10 border-primary text-primary"
        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-foreground/5"
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </Link>
);

export default function AppLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const pageTitle = navItems.find((i) => pathname.startsWith(i.href))?.title || "Overview";

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-[220px] fixed h-full border-r border-border bg-card flex flex-col z-20">
        <div className="p-6 flex items-center gap-2">
          <ShieldCheck className="text-primary" size={24} />
          <span className="font-display font-extrabold text-xl tracking-tighter">PHISHGUARD</span>
        </div>

        <nav className="flex-1 mt-4">
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.title}
              href={item.href}
              active={pathname.startsWith(item.href)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              {initials}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold truncate">{user?.name || "User"}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.role || "—"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-[220px]">
        <header className="sticky top-0 z-10 h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-8">
          <h2 className="font-display text-lg font-bold uppercase tracking-tight">{pageTitle}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-success/10 border border-success/20">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-mono text-success uppercase tracking-widest">
                System Online
              </span>
            </div>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
