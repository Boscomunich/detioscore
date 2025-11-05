import { LayoutDashboard, CreditCard, Users, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router";

const navigation = [
  { name: "Overview", href: "", icon: LayoutDashboard },
  { name: "Transactions", href: "transactions", icon: CreditCard },
  { name: "Users", href: "users", icon: Users },
  { name: "Competition", href: "competition", icon: Trophy },
];

export function Sidebar() {
  return (
    <div className="flex h-full w-full">
      <aside className="w-64 border-r border-border bg-sidebar">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <h1 className="font-mono text-lg font-semibold text-sidebar-foreground">
            Admin Dashboard
          </h1>
        </div>
        <nav className="space-y-1 p-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )
              }
              end
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
}
