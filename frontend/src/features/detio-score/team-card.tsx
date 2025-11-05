import { Star, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { LazyLoadImage } from "react-lazy-load-image-component";
import type { TeamWithOpponent } from "@/types/competition";

interface TeamCardProps extends TeamWithOpponent {
  isSelected: boolean;
  isStarred: boolean;
  onSelect: (teamId: number, teamName: string, teamLogo: string) => void;
  onStar: (fixtureId: number) => void;
}

export function TeamCard({
  fixtureId,
  team,
  opponent,
  matchDate,
  league,
  leagueLogo,
  matchVenue,
  isSelected,
  isStarred,
  onSelect,
  onStar,
}: TeamCardProps) {
  const formatMatchTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Card
      className={cn(
        "relative transition-all duration-200 hover:shadow-md cursor-pointer p-0",
        isSelected && "ring-2 ring-primary bg-primary/5"
      )}
    >
      <CardContent className="p-2 sm:p-3">
        {/* Star button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-1 right-1 p-0.5 h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onStar(fixtureId);
          }}
        >
          <Star
            className={cn(
              "h-3.5 w-3.5 transition-colors",
              isStarred
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        </Button>

        {/* Fixture selection */}
        <div
          className="flex flex-col gap-1.5 sm:gap-2"
          onClick={() => onSelect(team.id, team.name, team.logo)}
        >
          <Checkbox
            checked={isSelected}
            onChange={() => {}}
            className="mt-0.5 sm:mt-1"
          />

          {/* Teams matchup */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-3 sm:flex-row sm:justify-between text-center">
            {/* Home team */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              <LazyLoadImage
                src={
                  team.logo ||
                  "/placeholder.svg?height=30&width=30&query=football team logo"
                }
                alt={`${team.name} logo`}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
              />
              <h3 className="font-medium text-xs sm:text-sm mt-0.5 sm:mt-1 break-words text-center max-w-[100px]">
                {team.name}
              </h3>
            </div>

            {/* VS divider */}
            <div className="text-[10px] sm:text-xs font-medium text-muted-foreground sm:mx-2">
              vs
            </div>

            {/* Away team */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              <LazyLoadImage
                src={
                  opponent.logo ||
                  "/placeholder.svg?height=30&width=30&query=football team logo"
                }
                alt={`${opponent.name} logo`}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
              />
              <h3 className="font-medium text-xs sm:text-sm mt-0.5 sm:mt-1 break-words text-center max-w-[100px]">
                {opponent.name}
              </h3>
            </div>
          </div>

          {/* Match details */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 text-[11px] text-muted-foreground mt-0.5 sm:mt-1">
            <div className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              <span>{formatMatchTime(matchDate)}</span>
            </div>
            {matchVenue && (
              <div className="flex items-center gap-0.5 text-center">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[120px] sm:max-w-none">
                  {matchVenue}
                </span>
              </div>
            )}
          </div>

          {/* League info */}
          <div className="mt-0.5 sm:mt-1 flex items-center justify-center gap-0.5 sm:gap-1 text-center">
            <LazyLoadImage
              src={
                leagueLogo ||
                "/placeholder.svg?height=14&width=14&query=league logo"
              }
              alt={`${league} logo`}
              className="w-3.5 h-3.5 rounded"
            />
            <span className="text-[11px] text-muted-foreground break-words max-w-[180px]">
              {league}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
