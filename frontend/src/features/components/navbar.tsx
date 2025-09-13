import { Star, Table, Tally4, UserRoundCog } from "lucide-react";
import { SettingsPage } from "./settings";
import { Link, NavLink } from "react-router";
import { cn } from "@/lib/utils";
import { SheetCard } from "../football/layout";

const links = [
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
];

const profile = {
  name: "Profile",
  link: "/profile",
  icon: UserRoundCog,
};

export default function Navbar() {
  return (
    <div className="fixed top-0 w-full h-18 md:h-28 bg-primary flex flex-col gap-2 justify-between md:justify-evenly px-4 lg:px-12 z-[1000]">
      <div className="flex items-center justify-between h-full">
        <Link
          to=""
          className="text-white text-2xl lg:text-4xl font-bold flex justify-center gap-2 items-center"
        >
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="size-7 lg:size-12"
          />
          <h1>
            Ditio<span className="text-[#1E64AA]">Score</span>
          </h1>
        </Link>
        <div className="flex justify-center gap-4 items-center">
          <NavLink
            to={profile.link}
            end={profile.link === "/"}
            className={({ isActive }) =>
              cn(
                `md:flex flex-col hidden items-center justify-center rounded-xs px-2`,
                {
                  "text-blue-500": isActive,
                  "text-white": !isActive,
                }
              )
            }
          >
            <profile.icon size={20} />
            <span className="text-xs">{profile.name}</span>
          </NavLink>
          <div className="hidden md:block">
            <SettingsPage />
          </div>
          <SheetCard />
        </div>
      </div>
      <div className="hidden md:flex gap-2 justtify-start">
        {links.map((item, index) => (
          <NavLink
            to={item.link}
            key={index}
            end={item.link === "/"}
            className={({ isActive }) =>
              cn(`flex flex-col items-center justify-center rounded-xs px-2`, {
                "text-blue-500": isActive,
                "text-white": !isActive,
              })
            }
          >
            <item.icon size={20} />
            <span className="text-xs">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
