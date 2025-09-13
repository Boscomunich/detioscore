import CountriesCard from "./countries-card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search } from "lucide-react";
import { SettingsPage } from "../components/settings";
import { Outlet } from "react-router";
import { useState } from "react";

export default function FootballLayout() {
  return (
    <div className="flex justify-center items-start w-full gap-2 mb-18">
      <div className="hidden md:block">
        <CountriesCard />
      </div>
      <Outlet />
    </div>
  );
}

export function SheetCard() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild className="md:hidden">
        <div onClick={() => setIsSheetOpen(true)}>
          <Search className="cursor-pointer text-white" />
        </div>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 md:hidden overflow-y-auto top-18 flex flex-col justify-start start pt-4 pb-40 w-full"
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
