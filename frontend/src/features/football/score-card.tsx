import { useCallback, type JSX } from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { LazyLoadImage } from "react-lazy-load-image-component";
import type { FixtureResponse } from "../../types/football";
import { useLeague } from "../hooks/use-leagues";
import StarIcon from "../../components/ui/star";

export default function ScoreCard({ fixture }: { fixture: FixtureResponse }) {
  const navigate = useNavigate();
  const { favouriteIds, toggleFavourite } = useLeague();

  const status = fixture.fixture.status.short;
  const elapsed = fixture.fixture.status.elapsed;

  const isLive = [
    "1H",
    "HT",
    "2H",
    "ET",
    "BT",
    "P",
    "LIVE",
    "INT",
    "SUSP",
  ].includes(status);
  const isFinished = ["FT", "AET", "PEN"].includes(status);
  const isCancelled = ["CANC", "ABD", "AWD", "WO"].includes(status);
  const showScores = (isLive || isFinished) && !isCancelled;

  const formatTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }, []);

  const getStatusDisplay = useCallback(() => {
    const statusConfig: Record<
      string,
      { text: string; icon?: JSX.Element; color: string }
    > = {
      NS: {
        text: formatTime(fixture.fixture.date),
        icon: <Clock className="w-4 h-4" />,
        color: "text-muted-foreground",
      },
      "1H": { text: `${elapsed || 0}'`, color: "text-orange-500" },
      "2H": { text: `${elapsed || 45}'`, color: "text-orange-500" },
      ET: { text: `${elapsed || 90}'`, color: "text-orange-500" },
      BT: { text: "Break", color: "text-orange-500" },
      P: { text: "Penalty", color: "text-orange-500" },
      LIVE: { text: "Live", color: "text-orange-500" },
      INT: { text: "Interrupted", color: "text-orange-500" },
      SUSP: { text: "Suspended", color: "text-orange-500" },
      HT: { text: "HT", color: "text-orange-500" },
      FT: { text: "FT", color: "text-green-500" },
      AET: { text: "AET", color: "text-green-500" },
      PEN: { text: "PEN", color: "text-green-500" },
      CANC: { text: "Cancelled", color: "text-destructive" },
      ABD: { text: "Abandoned", color: "text-destructive" },
      AWD: { text: "Awarded", color: "text-destructive" },
      WO: { text: "Walkover", color: "text-destructive" },
    };
    const config = statusConfig[status] || {
      text: status,
      color: "text-muted-foreground",
    };
    return (
      <div className="flex flex-col md:flex-row items-center gap-2">
        {isLive && (
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        )}
        {config.icon}
        <Badge
          variant={isCancelled ? "secondary" : "outline"}
          className={cn("text-xs font-medium", config.color)}
        >
          {config.text}
        </Badge>
      </div>
    );
  }, [status, isLive, isCancelled, elapsed, fixture.fixture.date, formatTime]);

  const isFavourite = favouriteIds.has(fixture.fixture.id);

  return (
    <div
      className="bg-auto border-border border rounded-sm hover:bg-card/50 transition-colors p-0 flex items-center justify-between w-full px-4 py-3"
      onClick={() => navigate(`/${fixture.fixture.id}`, { state: { fixture } })}
    >
      {/* Status */}
      <div className="flex items-center min-w-[50px] shrink-0 mx-2">
        {getStatusDisplay()}
      </div>

      {/* Teams */}
      <div className="space-y-3 w-full max-w-[500px] cursor-pointer">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <LazyLoadImage
              src={fixture.teams.home.logo}
              alt={fixture.teams.home.name}
              className="size-5 object-contain"
            />
            <span className="text-sm font-medium text-foreground line-clamp-1">
              {fixture.teams.home.name}
            </span>
          </div>
          {showScores && (
            <div className="text-sm font-medium text-foreground min-w-[30px] text-center">
              {fixture.goals.home ?? "-"}
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <LazyLoadImage
              src={fixture.teams.away.logo}
              alt={fixture.teams.away.name}
              className="size-5 object-contain"
            />
            <span className="text-sm font-medium text-foreground line-clamp-1">
              {fixture.teams.away.name}
            </span>
          </div>
          {showScores && (
            <div className="text-sm font-medium text-foreground min-w-[30px] text-center">
              {fixture.goals.away ?? "-"}
            </div>
          )}
        </div>
      </div>

      {/* Favourite Button */}
      <Button
        variant="ghost"
        size="sm"
        className="p-1 h-auto"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavourite(fixture.fixture.id, fixture);
        }}
      >
        <StarIcon filled={isFavourite} size={36} className={cn()} />
      </Button>
    </div>
  );
}
