import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import type { PlayerData } from "../types";

export type StatType = "goals" | "assists" | "yellowCards" | "redCards";

interface PlayerStatsListProps {
  data: PlayerData[];
  statType: StatType;
  title: string;
  maxInitialDisplay?: number;
}

// Helper function to get the score based on stat type
function getPlayerScore(player: PlayerData, statType: StatType): number {
  const stats = player.statistics[0];
  if (!stats) return 0;

  switch (statType) {
    case "goals":
      return stats.goals.total;
    case "assists":
      return stats.goals.assists;
    case "yellowCards":
      return stats.cards.yellow;
    case "redCards":
      return stats.cards.red;
    default:
      return 0;
  }
}

// Helper function to get display label for the score
function getScoreLabel(statType: StatType): string {
  switch (statType) {
    case "goals":
      return "Goals";
    case "assists":
      return "Assists";
    case "yellowCards":
      return "Yellows";
    case "redCards":
      return "Reds";
    default:
      return "";
  }
}

function getHighlightColor(statType: StatType): string {
  switch (statType) {
    case "goals":
      return "bg-blue-500 text-white";
    case "assists":
      return "bg-green-500 text-white";
    case "yellowCards":
      return "bg-yellow-500 text-white";
    case "redCards":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

export function PlayerStatsList({
  data,
  statType,
  title,
  maxInitialDisplay = 3,
}: PlayerStatsListProps) {
  const [showAll, setShowAll] = useState(false);

  // Sort players by the selected stat type
  const sortedPlayers = [...data].sort(
    (a, b) => getPlayerScore(b, statType) - getPlayerScore(a, statType)
  );

  const displayedPlayers = showAll
    ? sortedPlayers
    : sortedPlayers.slice(0, maxInitialDisplay);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg md:text-xl font-bold">{title}</CardTitle>
        <ChevronRight className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {displayedPlayers.map((player, index) => {
          const score = getPlayerScore(player, statType);
          const stats = player.statistics[0];

          return (
            <div
              key={player.player.id}
              className="flex items-center justify-between gap-4 py-2"
            >
              <div className="flex items-center gap-4 flex-1">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={player.player.photo || "/placeholder.svg"}
                    alt={player.player.name}
                  />
                  <AvatarFallback>
                    {player.player.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-lg leading-none">
                    {player.player.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <img
                      src={stats?.team.logo || "/placeholder.svg"}
                      alt={`${stats?.team.name} badge`}
                      className="h-4 w-4"
                    />
                    <p className="text-sm text-muted-foreground">
                      {stats?.team.name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div
                  className={`flex items-center justify-center h-10 w-10 rounded-full font-bold text-lg ${
                    index === 0 && !showAll
                      ? getHighlightColor(statType)
                      : "text-foreground"
                  }`}
                >
                  {score}
                </div>
                {showAll && (
                  <span className="text-xs text-muted-foreground">
                    {getScoreLabel(statType)}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {!showAll && sortedPlayers.length > maxInitialDisplay && (
          <Button
            variant="outline"
            className="w-full mt-4 bg-transparent"
            onClick={() => setShowAll(true)}
          >
            See more ({sortedPlayers.length - maxInitialDisplay} more)
          </Button>
        )}
        {showAll && (
          <Button
            variant="outline"
            className="w-full mt-4 bg-transparent"
            onClick={() => setShowAll(false)}
          >
            Show less
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
