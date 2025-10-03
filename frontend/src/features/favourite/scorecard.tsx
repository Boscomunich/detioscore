import { type JSX, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { LazyLoadImage } from "react-lazy-load-image-component";
import type { FixtureEntity } from "./database";
import { useLeague } from "../hooks/use-leagues";

interface ScoreCardProps {
  fixture: FixtureEntity;
}

export default function ScoreCard({ fixture }: ScoreCardProps) {
  const { favouriteIds, toggleFavourite } = useLeague();
  const isFavourite = favouriteIds.has(fixture.fixtureId);

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
  ].includes(fixture.status);
  const isFinished = ["FT", "AET", "PEN"].includes(fixture.status);
  const isCancelled = ["CANC", "ABD", "AWD", "WO"].includes(fixture.status);
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
        text: formatTime(fixture.date),
        icon: <Clock className="w-4 h-4" />,
        color: "text-muted-foreground",
      },
      "1H": { text: "1H", color: "text-orange-500" },
      "2H": { text: "2H", color: "text-orange-500" },
      ET: { text: "ET", color: "text-orange-500" },
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

    const config = statusConfig[fixture.status] || {
      text: fixture.status,
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
  }, [fixture, formatTime, isLive, isCancelled]);

  return (
    <div className="bg-card border-border border rounded-sm hover:bg-accent/50 transition-colors p-0 flex items-center justify-between w-full px-4 py-3">
      {/* Status */}
      <div className="flex items-center min-w-[100px]">
        {getStatusDisplay()}
      </div>

      {/* Teams */}
      <div className="space-y-3 w-full max-w-[500px] cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <LazyLoadImage
              src={fixture.homeTeamLogo}
              alt={fixture.homeTeamName}
              className="size-5 object-contain"
            />
            <span className="text-sm font-medium text-foreground line-clamp-1">
              {fixture.homeTeamName}
            </span>
          </div>
          {showScores && (
            <div className="text-sm font-medium text-foreground min-w-[30px] text-center">
              {fixture.goalsHome ?? "-"}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <LazyLoadImage
              src={fixture.awayTeamLogo}
              alt={fixture.awayTeamName}
              className="size-5 object-contain"
            />
            <span className="text-sm font-medium text-foreground line-clamp-1">
              {fixture.awayTeamName}
            </span>
          </div>
          {showScores && (
            <div className="text-sm font-medium text-foreground min-w-[30px] text-center">
              {fixture.goalsAway ?? "-"}
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
          e.stopPropagation(); // prevent card navigation
          toggleFavourite(fixture.fixtureId);
        }}
      >
        <Star
          className={cn(
            "w-5 h-5",
            isFavourite ? "text-yellow-400" : "text-muted-foreground"
          )}
        />
      </Button>
    </div>
  );
}
