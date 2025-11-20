import { useState } from "react";
import GlobalRank from "./components/global-rank";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const RANKS = ["all", "topscore", "mangoset", "league"];

export default function RankTables() {
  const [currentLeagueIndex, setCurrentLeagueIndex] = useState(0);
  const selected = RANKS[currentLeagueIndex] as
    | "topscore"
    | "mangoset"
    | "league"
    | "all";

  const handlePrevious = () => {
    setCurrentLeagueIndex((prev) => (prev === 0 ? RANKS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentLeagueIndex((prev) => (prev === RANKS.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-sm mx-auto bg-auto rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border/40 bg-muted/30">
        <button
          onClick={handlePrevious}
          className="p-1 hover:bg-muted rounded-md transition-colors"
          aria-label="Previous league"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 flex-1 justify-center">
          <h3 className="font-semibold text-base capitalize leading-tight text-center">
            {selected}
          </h3>
        </div>

        <button
          onClick={handleNext}
          className="p-1 hover:bg-muted rounded-md transition-colors"
          aria-label="Next league"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* League Indicator Dots */}
      <div className="flex justify-center gap-1 py-2 border-b border-border/40">
        {RANKS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentLeagueIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index === currentLeagueIndex
                ? "bg-primary"
                : "bg-muted-foreground/30"
            )}
            aria-label={`View ${RANKS[index]}`}
          />
        ))}
      </div>
      <GlobalRank type={selected} />
    </div>
  );
}
