import * as React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Sidebar } from "./sidebar";

export default function AdminNav() {
  return (
    <div className="h-10 w-full fixed lg:hidden top-0 z-100 bg-gray-200">
      <SheetCard />
    </div>
  );
}

function SheetCard() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
        >
          <Menu className="cursor-pointer" />
        </button>
      </SheetTrigger>

      {/* Sheet Content */}
      <SheetContent
        side="left"
        className="p-0 md:hidden overflow-y-auto top-10 flex flex-col justify-start pt-4 pb-40"
      >
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
