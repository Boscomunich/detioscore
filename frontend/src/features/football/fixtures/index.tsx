import { ChevronLeft, ChevronRight } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import FixturesCard from "./fixtures-card";
import LiveFixturesCard from "./live-fixtures-card";
import { cn } from "@/lib/utils";
import { useLeague } from "@/features/hooks/use-leagues";

function normalizeDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default function Fixtures() {
  const { currentDate, setCurrentDate } = useLeague();
  const [isLive, setIsLive] = useState(false);

  const handleDateChange = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(normalizeDate(newDate));
  };

  return (
    <div className="max-w-3xl px-4 border rounded-sm my-2 w-[98%] mx-auto pb-6">
      {/* Top navigation bar */}
      <div className="flex items-center justify-between my-4 p-2">
        <div
          className={cn(
            "size-12 rounded-full flex items-center justify-center text-xs font-semibold hover:cursor-pointer border border-primary",
            isLive && "bg-primary animate-pulse text-white"
          )}
          onClick={() => setIsLive(!isLive)}
        >
          Live
        </div>
        <div className="flex items-center justify-between w-[80%]">
          <ChevronLeft
            className="cursor-pointer"
            onClick={() => handleDateChange(-1)}
          />
          <DateSelector />
          <ChevronRight
            className="cursor-pointer"
            onClick={() => handleDateChange(1)}
          />
        </div>
      </div>
      {isLive ? <LiveFixturesCard /> : <FixturesCard />}
    </div>
  );
}

function DateSelector() {
  const [open, setOpen] = useState(false);
  const { currentDate, setCurrentDate } = useLeague();

  const dateFormat: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div id="date" className="capitalize text-sm cursor-pointer">
            {currentDate.toLocaleDateString("en-US", dateFormat)}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={(date) => {
              if (date) {
                setCurrentDate(normalizeDate(date));
                setOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
