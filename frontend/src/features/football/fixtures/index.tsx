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
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
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
    <div className="w-full mx-auto p-4 max-w-2xl ">
      {/* Header */}
      <div className="flex gap-3 md:gap-6 items-center justify-center w-full px-4">
        {/* Live Toggle */}
        <button
          onClick={() => setIsLive(!isLive)}
          className={cn(
            "rounded-full shrink-0 text-sm font-semibold  transition-all size-12 md:size-16 py-2",
            isLive
              ? "bg-primary animate-pulse text-white"
              : "bg-auto text-foreground"
          )}
        >
          Live
        </button>

        {/* Date Navigation */}
        <div className="flex items-center justify-center w-full gap-4 rounded-xl bg-auto px-4 py-3">
          <ChevronLeft
            className="size-5 sm:size-6 cursor-pointer hover:text-foreground/80 transition-transform hover:scale-110"
            onClick={() => handleDateChange(-1)}
          />
          <div className="flex-1 min-w-[200px]">
            <DateSelector />
          </div>
          <ChevronRight
            className="size-5 sm:size-6 cursor-pointer hover:text-foreground/80 transition-transform hover:scale-110"
            onClick={() => handleDateChange(1)}
          />
        </div>
      </div>

      {/* Fixtures Content */}
      <div className="mt-6 w-full">
        {isLive ? <LiveFixturesCard /> : <FixturesCard />}
      </div>
    </div>
  );
}

function DateSelector() {
  const [open, setOpen] = useState(false);
  const { currentDate, setCurrentDate } = useLeague();

  // ✅ Use local midnight for today and selected date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = new Date(currentDate);
  selected.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (selected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  let label = "";
  if (diffDays === -1) label = "Yesterday";
  else if (diffDays === 0) label = "Today";
  else if (diffDays === 1) label = "Tomorrow";
  else {
    label = selected.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="w-full text-sm sm:text-base cursor-pointer px-4 py-1.5 md:py-2.5 rounded-md text-center font-medium">
          {label}
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="center"
        className="p-2 border rounded-xl bg-background shadow-md w-auto"
      >
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            if (date) {
              setCurrentDate(normalizeDate(date));
              setOpen(false);
            }
          }}
          className="rounded-xl"
        />
      </PopoverContent>
    </Popover>
  );
}
