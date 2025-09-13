import { cn } from "@/lib/utils";
import { House, Star, Table, Tally4, UserRoundCog } from "lucide-react";
import { NavLink } from "react-router";

const links = [
  {
    name: "Home",
    link: "",
    icon: House,
  },
  {
    name: "Favourite",
    link: "/favourite",
    icon: Star,
  },
  {
    name: "DS",
    link: "/detio-score",
    icon: Tally4,
  },
  {
    name: "League",
    link: "/league",
    icon: Table,
  },
  {
    name: "Profile",
    link: "/profile",
    icon: UserRoundCog,
  },
];

export default function BottomTabs() {
  return (
    <div className="h-16 w-full md:hidden fixed bottom-0 px-4 py-2 flex gap-2 justify-between bg-sidebar-accent z-100">
      {links.map((item, index) => (
        <NavLink
          to={item.link}
          key={index}
          end={item.link === "/"}
          className={({ isActive }) =>
            cn(
              `flex flex-col items-center justify-center rounded-xs px-2 flex-1`,
              {
                "bg-orange-100 text-primary": isActive,
                " hover:bg-secondary": !isActive,
              }
            )
          }
        >
          <item.icon size={20} />
          <span className="text-xs">{item.name}</span>
        </NavLink>
      ))}
    </div>
  );
}
