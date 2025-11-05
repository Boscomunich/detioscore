import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClient } from "@/api-config";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type {
  CalculatedTeamStanding,
  Leagues,
  TeamStanding,
} from "@/types/football";

export default function LeagueTable({ league }: { league: Leagues }) {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "HOME" | "AWAY">(
    "ALL"
  );

  const { data, isLoading } = useQuery({
    queryKey: ["standings", league?.league.id, league?.seasons[0].year],
    queryFn: async () => {
      const response = await apiClient.get(
        `/livescore/standings?leagueId=${league?.league.id}&season=${league?.seasons[0].year}`
      );
      return response.data;
    },
    enabled: !!league,
  });

  const getFormColor = (result: string) => {
    if (result === "W") return "bg-green-500";
    if (result === "L") return "bg-red-500";
    return "bg-gray-400";
  };

  // Calculate filtered standings based on home/away selection
  const filteredStandings = useMemo<CalculatedTeamStanding[]>(() => {
    const teams: TeamStanding[] =
      data?.response?.[0]?.league?.standings?.[0] || [];
    if (activeFilter === "ALL") {
      return teams.map((team) => ({
        ...team,
        calculatedPoints: team.points,
        calculatedGoalsDiff: team.goalsDiff,
        calculatedRank: team.rank,
      }));
    }

    const filteredTeams: CalculatedTeamStanding[] = teams.map((team) => {
      const stats = activeFilter === "HOME" ? team.home : team.away;
      const points = stats.win * 3 + stats.draw * 1;
      const goalsDiff = stats.goals.for - stats.goals.against;

      return {
        ...team,
        calculatedPoints: points,
        calculatedGoalsDiff: goalsDiff,
        calculatedPlayed: stats.played,
        calculatedWin: stats.win,
        calculatedDraw: stats.draw,
        calculatedLose: stats.lose,
        calculatedGoalsFor: stats.goals.for,
        calculatedGoalsAgainst: stats.goals.against,
      };
    });

    // Sort by points, then goal difference, then goals for
    return filteredTeams
      .sort((a, b) => {
        if (b.calculatedPoints! !== a.calculatedPoints!)
          return b.calculatedPoints! - a.calculatedPoints!;
        if (b.calculatedGoalsDiff! !== a.calculatedGoalsDiff!)
          return b.calculatedGoalsDiff! - a.calculatedGoalsDiff!;
        return b.calculatedGoalsFor! - a.calculatedGoalsFor!;
      })
      .map((team, index) => ({
        ...team,
        calculatedRank: index + 1,
      }));
  }, [activeFilter, data]);

  return (
    <div className="w-[98%] border bg-auto rounded-sm mx-auto p-4 md:p-6">
      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(["ALL", "HOME", "AWAY"] as const).map((filter) => (
          <Button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "px-6 py-2 rounded-sm text-sm font-medium transition-colors whitespace-nowrap hover:bg-card",
              activeFilter === filter
                ? "bg-primary"
                : "bg-card border-gray-300 text-foreground"
            )}
          >
            {filter === "ALL" ? "All" : filter === "HOME" ? "Home" : "Away"}
          </Button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead className="min-w-[200px]">Team</TableHead>
                  <TableHead className="text-center">PL</TableHead>
                  <TableHead className="text-center">W</TableHead>
                  <TableHead className="text-center">D</TableHead>
                  <TableHead className="text-center">L</TableHead>
                  <TableHead className="hidden md:table-cell text-center">
                    GF
                  </TableHead>
                  <TableHead className="hidden md:table-cell text-center">
                    GA
                  </TableHead>
                  <TableHead className="text-center">GD</TableHead>
                  <TableHead className="text-center">PTS</TableHead>
                  <TableHead className="hidden md:table-cell text-center">
                    Form
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStandings.map((team) => {
                  const isHomeAway = activeFilter !== "ALL";
                  const played = isHomeAway
                    ? team.calculatedPlayed!
                    : team.all.played;
                  const win = isHomeAway ? team.calculatedWin! : team.all.win;
                  const draw = isHomeAway
                    ? team.calculatedDraw!
                    : team.all.draw;
                  const lose = isHomeAway
                    ? team.calculatedLose!
                    : team.all.lose;
                  const goalsFor = isHomeAway
                    ? team.calculatedGoalsFor!
                    : team.all.goals.for;
                  const goalsAgainst = isHomeAway
                    ? team.calculatedGoalsAgainst!
                    : team.all.goals.against;
                  const goalsDiff = isHomeAway
                    ? team.calculatedGoalsDiff!
                    : team.goalsDiff;
                  const points = isHomeAway
                    ? team.calculatedPoints!
                    : team.points;
                  const rank = isHomeAway ? team.calculatedRank! : team.rank;

                  return (
                    <TableRow key={team.team.id}>
                      <TableCell className="font-medium">{rank}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={team.team.logo || "/placeholder.svg"}
                            alt={`${team.team.name} logo`}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm font-medium">
                            {team.team.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{played}</TableCell>
                      <TableCell className="text-center">{win}</TableCell>
                      <TableCell className="text-center">{draw}</TableCell>
                      <TableCell className="text-center">{lose}</TableCell>
                      <TableCell className="hidden md:table-cell text-center">
                        {goalsFor}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-center">
                        {goalsAgainst}
                      </TableCell>
                      <TableCell className="text-center">
                        {goalsDiff > 0 ? `+${goalsDiff}` : goalsDiff}
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {points}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex gap-1 justify-center">
                          {team.form.split("").map((result, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold",
                                getFormColor(result)
                              )}
                            >
                              {result}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
