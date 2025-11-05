import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClient } from "@/api-config";
import { cn } from "@/lib/utils";
import type { TeamStanding } from "@/types/football";
import { LazyLoadImage } from "react-lazy-load-image-component";

// ✅ Top Leagues (API IDs + logos)
const TOP_LEAGUES = [
  {
    id: 39,
    name: "Premier League",
    country: "England",
    logo: "https://media.api-sports.io/football/leagues/39.png",
  },
  {
    id: 2,
    name: "Champions League",
    country: "Europe",
    logo: "https://media.api-sports.io/football/leagues/2.png",
  },
  {
    id: 140,
    name: "La Liga",
    country: "Spain",
    logo: "https://media.api-sports.io/football/leagues/140.png",
  },
  {
    id: 135,
    name: "Serie A",
    country: "Italy",
    logo: "https://media.api-sports.io/football/leagues/135.png",
  },
  {
    id: 78,
    name: "Bundesliga",
    country: "Germany",
    logo: "https://media.api-sports.io/football/leagues/78.png",
  },
];

/**
 * Gets the appropriate football season based on European football calendar
 * Season runs from August to July
 * - Before August: use previous year as season
 * - August onwards: use current year as season
 */
function getCurrentFootballSeason(): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // January = 1, December = 12

  // If it's before August (month 8), use previous year as season
  // If it's August or later, use current year as season
  return currentMonth < 8 ? currentYear - 1 : currentYear;
}

export default function MiniLeagueTables() {
  const [currentLeagueIndex, setCurrentLeagueIndex] = useState(0);
  const currentLeague = TOP_LEAGUES[currentLeagueIndex];
  const currentSeason = getCurrentFootballSeason();

  const handlePrevious = () => {
    setCurrentLeagueIndex((prev) =>
      prev === 0 ? TOP_LEAGUES.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentLeagueIndex((prev) =>
      prev === TOP_LEAGUES.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="w-full max-w-xs mx-auto bg-auto rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border/40 bg-muted/30">
        <button
          onClick={handlePrevious}
          className="p-1 hover:bg-muted rounded-md transition-colors"
          aria-label="Previous league"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 flex-1 justify-center">
          <LazyLoadImage
            src={currentLeague.logo}
            alt={currentLeague.name}
            className="w-8 h-8 object-contain"
          />
          <div className="text-center">
            <h3 className="font-semibold text-base leading-tight">
              {currentLeague.name}
            </h3>
            <div className="flex items-center gap-1 justify-center">
              <p className="text-xs text-muted-foreground">
                {currentLeague.country}
              </p>
              <span className="text-xs text-muted-foreground">•</span>
              <p className="text-xs text-muted-foreground">
                Season {currentSeason}/{String(currentSeason + 1).slice(-2)}
              </p>
            </div>
          </div>
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
        {TOP_LEAGUES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentLeagueIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index === currentLeagueIndex
                ? "bg-primary"
                : "bg-muted-foreground/30"
            )}
            aria-label={`View ${TOP_LEAGUES[index].name}`}
          />
        ))}
      </div>

      {/* Table Content */}
      <MiniLeagueTable league={currentLeague} season={currentSeason} />
    </div>
  );
}

function MiniLeagueTable({
  league,
  season,
}: {
  league: { id: number; name: string; country: string; logo: string };
  season: number;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["mini-table", league.id, season],
    queryFn: async () => {
      const res = await apiClient.get(
        `/livescore/standings?leagueId=${league.id}&season=${season}`
      );
      return res.data;
    },
  });

  const standings: TeamStanding[] =
    data?.response?.[0]?.league?.standings?.[0] ?? [];

  return (
    <div className="overflow-x-auto max-w-xs">
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 text-xs">#</TableHead>
              <TableHead className="text-xs min-w-[120px]">Team</TableHead>
              <TableHead className="text-xs text-center">PL</TableHead>
              <TableHead className="text-xs text-center">GD</TableHead>
              <TableHead className="text-xs text-center">PTS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {standings.map((team) => (
              <TableRow
                key={team.team.id}
                className={cn(
                  "hover:bg-muted/40 transition-colors",
                  team.rank <= 4 && "border-l-2 border-l-green-500",
                  team.rank >= standings.length - 2 &&
                    "border-l-2 border-l-red-500"
                )}
              >
                <TableCell className="text-xs font-medium">
                  {team.rank}
                </TableCell>
                <TableCell className="flex items-center gap-2 truncate">
                  <img
                    src={team.team.logo}
                    alt={team.team.name}
                    className="w-5 h-5 object-contain"
                  />
                  <span className="truncate text-sm">{team.team.name}</span>
                </TableCell>
                <TableCell className="text-center text-xs">
                  {team.all.played}
                </TableCell>
                <TableCell className="text-center text-xs">
                  {team.goalsDiff > 0 ? `+${team.goalsDiff}` : team.goalsDiff}
                </TableCell>
                <TableCell className="text-center text-xs font-semibold">
                  {team.points}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
