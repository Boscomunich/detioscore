import { Star, Table, Tally4, User } from "lucide-react";
import { SettingsPage } from "./settings";
import { Link, NavLink, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { SheetCard } from "../football/layout";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const links = [
  { name: "Favourite", link: "/favourite", icon: Star },
  { name: "DS", link: "/detio-score", icon: Tally4 },
];

// const profile = { name: "Profile", link: "/profile", icon: UserRoundCog };
const admin = { name: "Admin", link: "/admin", icon: Table };

export default function Navbar() {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <div className="fixed top-0 left-0 w-full h-20 md:h-24 bg-black shadow-sm flex items-center justify-between px-6 md:px-12 z-[1000] text-white">
      <Link to="/" className="flex items-center gap-2 font-bold text-4xl">
        <img src="/assets/logo.png" alt="Logo" className="w-7 h-7" />
        <h1>
          Ditio<span className="text-brand">Score</span>
        </h1>
      </Link>

      <div className="lg:flex items-center gap-6 hidden">
        {links.map((item, index) => (
          <NavLink
            to={item.link}
            key={index}
            end={item.link === "/"}
            className={({ isActive }) =>
              cn("flex items-center gap-1 text-base hover:text-brand/60", {
                "text-brand": isActive,
              })
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}

        {/* Profile */}
        <Button
          className={cn(
            "flex justify-center gap-2 w-24 py-3 items-center text-base font-semibold",
            user && "hidden"
          )}
          onClick={() => navigate("/signin")}
        >
          <User size={20} />
          Login
        </Button>

        {
          //@ts-expect-error user role exist
          user?.role === "admin" && (
            <NavLink
              to={admin.link}
              className={({ isActive }) =>
                cn("flex items-center gap-1 text-base  hover:text-brand/60", {
                  "text-brand": isActive,
                })
              }
            >
              <admin.icon size={20} />
              <span>{admin.name}</span>
            </NavLink>
          )
        }
        <div className="flex items-center gap-3">
          <SettingsPage />
        </div>
      </div>
      <SheetCard />
    </div>
  );
}
