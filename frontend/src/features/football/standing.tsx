import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useLeague } from "../hooks/use-leagues";
import { cn } from "@/lib/utils";
import type { CalculatedTeamStanding, TeamStanding } from "./type";

export default function Standing() {
  const { league } = useLeague();
  const [activeFilter, setActiveFilter] = useState<"ALL" | "HOME" | "AWAY">(
    "ALL"
  );

  const { data, isLoading } = useQuery({
    queryKey: ["standings", league?.league.id, league?.seasons[0].year],
    queryFn: async () => {
      const response = await apiClient.get(
        `/livescore/get-standings?leagueId=${league?.league.id}&season=${league?.seasons[0].year}`
      );
      return response.data;
    },
    enabled: !!league,
  });

  const getFormColor = (form: string) => {
    if (!form) return "bg-transparent";

    const wins = (form.match(/W/g) || []).length;
    const losses = (form.match(/L/g) || []).length;

    if (wins >= 3) return "bg-green-500";
    if (losses >= 3) return "bg-red-500";
    return "bg-yellow-500";
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
      const points = stats.win * 3 + stats.draw;
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
  }, [data, activeFilter]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 bg-background no-scrollbar">
      <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto pb-2">
        {(["ALL", "HOME", "AWAY"] as const).map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            onClick={() => setActiveFilter(filter)}
            className="px-4 md:px-6 text-xs md:text-sm whitespace-nowrap"
          >
            {filter}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="w-8 md:w-12 text-center text-xs md:text-sm">
                  #
                </TableHead>
                <TableHead className="min-w-[120px] md:min-w-[200px] text-xs md:text-sm">
                  TEAM
                </TableHead>
                <TableHead className="w-8 md:w-12 text-center text-xs md:text-sm">
                  P
                </TableHead>
                <TableHead className="w-8 md:w-12 text-center text-xs md:text-sm">
                  W
                </TableHead>
                <TableHead className="w-8 md:w-12 text-center text-xs md:text-sm">
                  D
                </TableHead>
                <TableHead className="w-8 md:w-12 text-center text-xs md:text-sm">
                  L
                </TableHead>
                <TableHead className="hidden md:table-cell w-12 text-center text-xs md:text-sm">
                  F
                </TableHead>
                <TableHead className="hidden md:table-cell w-12 text-center text-xs md:text-sm">
                  A
                </TableHead>
                <TableHead className="w-8 md:w-12 text-center text-xs md:text-sm">
                  GD
                </TableHead>
                <TableHead className="w-8 md:w-12 text-center text-xs md:text-sm font-bold">
                  PTS
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
                const draw = isHomeAway ? team.calculatedDraw! : team.all.draw;
                const lose = isHomeAway ? team.calculatedLose! : team.all.lose;
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
                  <TableRow
                    key={team.team.id}
                    className="border-b hover:bg-muted/50"
                  >
                    <TableCell className="text-center font-medium relative text-xs md:text-sm">
                      <div
                        className={cn(
                          "absolute left-0 top-0 bottom-0 w-1",
                          getFormColor(team.form)
                        )}
                      />
                      {rank}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 md:gap-3">
                        <img
                          src={team.team.logo || "/placeholder.svg"}
                          alt={`${team.team.name} logo`}
                          className="w-5 h-5 md:w-6 md:h-6 rounded-full"
                        />
                        <span className="font-medium text-xs md:text-sm truncate">
                          {team.team.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-xs md:text-sm">
                      {played}
                    </TableCell>
                    <TableCell className="text-center text-xs md:text-sm">
                      {win}
                    </TableCell>
                    <TableCell className="text-center text-xs md:text-sm">
                      {draw}
                    </TableCell>
                    <TableCell className="text-center text-xs md:text-sm">
                      {lose}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center text-xs md:text-sm">
                      {goalsFor}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center text-xs md:text-sm">
                      {goalsAgainst}
                    </TableCell>
                    <TableCell className="text-center text-xs md:text-sm">
                      {goalsDiff}
                    </TableCell>
                    <TableCell className="text-center font-bold text-xs md:text-sm">
                      {points}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
