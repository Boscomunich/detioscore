"use client";
import { Star, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { FixtureResponse, TeamInfo } from "@/features/football/type";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface TeamCardProps {
  team: TeamInfo;
  opponent: TeamInfo;
  fixture: FixtureResponse;
  isSelected: boolean;
  isStarred: boolean;
  onSelect: (teamId: number, teamName: string, teamLogo: string) => void;
  onStar: (teamId: number) => void;
}

export function TeamCard({
  team,
  opponent,
  fixture,
  isSelected,
  isStarred,
  onSelect,
  onStar,
}: TeamCardProps) {
  const formatMatchTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card
      className={cn(
        "relative transition-all duration-200 hover:shadow-md cursor-pointer p-0",
        isSelected && "ring-2 ring-primary bg-primary/5"
      )}
    >
      <CardContent className="p-2 md:p-4">
        {/* Star button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 p-1 h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onStar(team.id);
          }}
        >
          <Star
            className={cn(
              "h-4 w-4 transition-colors",
              isStarred
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        </Button>

        {/* Team selection */}
        <div
          className="flex flex-col md:flex-row items-start gap-3 mb-3"
          onClick={() => onSelect(team.id, team.name, team.logo)}
        >
          <Checkbox checked={isSelected} onChange={() => {}} className="mt-1" />

          <div className="flex-1">
            {/* Team info */}
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
              <LazyLoadImage
                src={
                  team.logo ||
                  "/placeholder.svg?height=32&width=32&query=football team logo"
                }
                alt={`${team.name} logo`}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-sm text-balance leading-tight">
                  {team.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  vs {opponent.name}
                </p>
              </div>
            </div>

            {/* Match details */}
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatMatchTime(fixture?.fixture.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{fixture?.fixture.venue.name}</span>
              </div>
            </div>

            {/* League info */}
            <div className="mt-2 flex items-center gap-2">
              <LazyLoadImage
                src={
                  fixture?.league.logo ||
                  "/placeholder.svg?height=16&width=16&query=league logo"
                }
                alt={`${fixture.league.name} logo`}
                className="w-4 h-4 rounded"
              />
              <span className="text-xs text-muted-foreground">
                {fixture?.league.name}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
