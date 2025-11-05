// ranking.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Star, Users, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router";
import type { TeamRankingsTableProps } from "@/types/competition";

export function TeamRankingsTable({
  rankings,
  competitionType,
  className,
}: TeamRankingsTableProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />;
      case 2:
        return <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />;
      case 3:
        return <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const navigate = useNavigate();

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-2 text-base font-bold text-[#1E64AA] my-4">
        <Target className="h-5 w-5 sm:h-6 sm:w-6" />
        Participant Rankings - {competitionType}
      </div>

      {rankings.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No participants yet</p>
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table className="min-w-[500px]">
            <TableHeader className="hidden md:table-header-group bg-background/50">
              <TableRow className="text-base font-bold">
                <TableHead className="w-20">Rank</TableHead>
                <TableHead>Participant</TableHead>
                <TableHead>Teams</TableHead>
                <TableHead>Total Points</TableHead>
                <TableHead>Staked</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rankings.map((entry) => (
                <TableRow
                  key={entry._id}
                  className={cn(
                    "hover:bg-muted/50 border-b md:table-row flex flex-col gap-1 md:gap-0 p-2 md:p-0 cursor-pointer"
                  )}
                  onClick={() =>
                    navigate("/detio-score/participant", { state: entry })
                  }
                >
                  {/* Rank */}
                  <TableCell className="px-2 sm:px-4 md:table-cell md:text-center">
                    <div className="flex items-center gap-2 md:justify-center">
                      <span className="font-bold text-sm sm:text-base">
                        {entry.rank}.
                      </span>
                      {getRankIcon(entry.rank)}
                      <div className="flex items-center gap-2 md:hidden">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={entry.user.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {entry.user.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">
                          {entry.user.username}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Participant (desktop only) */}
                  <TableCell className="hidden md:table-cell px-2 sm:px-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarImage
                          src={entry.user.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {entry.user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">
                        {entry.user.username}
                      </span>
                    </div>
                  </TableCell>
                  {/* Teams */}
                  <TableCell className="px-2 sm:px-4">
                    <div className="flex gap-3 md:gap-4 sm:gap-4 overflow-x-auto pb-1">
                      {entry.teams.map((team, index) => {
                        // Find teamPoints for this fixture
                        const teamPoint = entry.teamPoints?.find(
                          (tp) =>
                            String(tp.fixtureId) === String(team.fixtureId)
                        );

                        const homeScore = teamPoint?.score?.home ?? null;
                        const awayScore = teamPoint?.score?.away ?? null;
                        const isLive = teamPoint?.isLive ?? false;
                        const isFT = teamPoint?.isFT ?? false;

                        return (
                          <div
                            key={index}
                            className="flex flex-col items-center justify-center relative"
                          >
                            <div className="flex items-center gap-1">
                              {/* Home */}
                              <div
                                className={cn(
                                  "flex-shrink-0 relative",
                                  entry.starFixture === team.fixtureId
                                    ? "ring ring-yellow-500 rounded-full"
                                    : ""
                                )}
                              >
                                <div className="size-7 sm:size-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                                  {team.home.logo ? (
                                    <LazyLoadImage
                                      src={team.home.logo}
                                      alt={team.home.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-[10px] sm:text-xs font-bold text-muted-foreground">
                                      {team.home.name.slice(0, 2).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Score */}
                              <div className="flex flex-col items-center justify-center">
                                <p className="text-xs font-semibold">
                                  {homeScore != null && awayScore != null
                                    ? `${homeScore}-${awayScore}`
                                    : "vs"}
                                </p>

                                {/* LIVE or FT indicator */}
                                {isLive && (
                                  <span className="text-xs bg-red-500 font-medium font-syne animate-pulse size-2 rounded-full" />
                                )}
                                {!isLive && isFT && (
                                  <span className="text-xs text-gray-500 font-medium">
                                    FT
                                  </span>
                                )}
                              </div>

                              {/* Away */}
                              <div
                                className={cn(
                                  "flex-shrink-0 relative",
                                  entry.starFixture === team.fixtureId
                                    ? "ring ring-yellow-500 rounded-full"
                                    : ""
                                )}
                              >
                                <div className="size-7 sm:size-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                                  {team.away.logo ? (
                                    <LazyLoadImage
                                      src={team.away.logo}
                                      alt={team.away.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-[10px] sm:text-xs font-bold text-muted-foreground">
                                      {team.away.name.slice(0, 2).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Star icon */}
                              {entry.starFixture === team.fixtureId && (
                                <Star className="absolute -top-1 -right-1 h-2.5 w-2.5 text-yellow-500 fill-current" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TableCell>

                  {/* Points & Stake (mobile) */}
                  <TableCell className="px-2 sm:px-4 md:hidden">
                    <div className="flex items-center justify-start gap-8 w-auto text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{entry.totalPoints}</span>
                        <span className="text-xs text-muted-foreground">
                          pts
                        </span>
                      </div>
                      <span className="font-medium">
                        Stake: ${entry.stakedAmount}
                      </span>
                    </div>
                  </TableCell>

                  {/* Desktop Points */}
                  <TableCell className="hidden md:table-cell px-2 sm:px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-bold text-sm sm:text-lg">
                        {entry.totalPoints}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        pts
                      </span>
                    </div>
                  </TableCell>

                  {/* Desktop Stake */}
                  <TableCell className="hidden md:table-cell px-2 sm:px-4 text-center">
                    <span className="font-medium text-sm sm:text-base">
                      ${entry.stakedAmount}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
