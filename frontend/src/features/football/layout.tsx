import CountriesCard from "./countries-card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search } from "lucide-react";
import { SettingsPage } from "../components/settings";
import { Outlet } from "react-router";
import { useState } from "react";
import LeagueNav from "./league-nav";
import MiniLeagueTables from "./mini-table";

export default function FootballLayout() {
  return (
    <section className="w-full max-w-7xl mx-auto ">
      <div className="flex flex-col gap-2 mb-18">
        <div className="w-full mx-auto hidden lg:block mb-10">
          <LeagueNav />
        </div>

        {/* Core content row */}
        <div className="flex justify-center items-start w-full mt-2">
          {/* Left: Countries */}
          <div className="hidden lg:flex flex-col w-[250px] flex-shrink-0">
            <CountriesCard />
          </div>

          <Outlet />

          {/* Right: Mini tables */}
          <div className="hidden lg:flex shrink-0 w-xs">
            <MiniLeagueTables />
          </div>
        </div>
      </div>
    </section>
  );
}
export function SheetCard() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild className="lg:hidden">
        <div onClick={() => setIsSheetOpen(true)}>
          <Search className="cursor-pointer text-white" />
        </div>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 md:hidden overflow-y-auto top-20 flex flex-col justify-start start pt-4 pb-40 w-full"
      >
        <div className="mx-4">
          <SettingsPage />
        </div>
        <div className="w-full flex justify-center  px-4 py-2 relative">
          <CountriesCard onCloseSheet={() => setIsSheetOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
