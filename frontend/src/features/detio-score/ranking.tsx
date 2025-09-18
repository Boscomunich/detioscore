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

interface Team {
  teamId: string;
  name: string;
  logo?: string;
}

interface TeamPoints {
  teamId: string;
  points: number;
}

interface RankingEntry {
  _id: string;
  rank: number;
  user: {
    username: string;
    avatar?: string;
  };
  teams: Team[];
  starTeam?: string | null;
  teamPoints: TeamPoints[];
  totalPoints: number;
  stakedAmount: number;
  joinedAt: string;
}

interface TeamRankingsTableProps {
  rankings: RankingEntry[];
  competitionType: string;
  className?: string;
}

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
            {/* Desktop Header */}
            <TableHeader className="hidden md:table-header-group">
              <TableRow>
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
                    "hover:bg-muted/50 border-b md:table-row flex flex-col gap-1 md:gap-0 p-2 md:p-0"
                  )}
                >
                  {/* Rank (mobile: with username) */}
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
                    <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-1">
                      {entry.teams.map((team, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex-shrink-0 relative",
                            entry.starTeam === team.teamId
                              ? "ring-2 ring-yellow-500 rounded-full"
                              : ""
                          )}
                        >
                          <div className="size-6 sm:size-7 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                            {team.logo ? (
                              <LazyLoadImage
                                src={team.logo}
                                alt={team.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] sm:text-xs font-bold text-muted-foreground">
                                {team.name.slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>

                          {entry.starTeam === team.teamId && (
                            <Star className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 fill-current" />
                          )}
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  {/* Points & Stake (mobile combined) */}
                  <TableCell className="px-2 sm:px-4 md:hidden">
                    <div className="flex items-center justify-start gap-8 w-auto text-sm">
                      {/* Points */}
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{entry.totalPoints}</span>
                        <span className="text-xs text-muted-foreground">
                          pts
                        </span>
                      </div>
                      {/* Stake */}
                      <span className="font-medium">
                        Stake: ${entry.stakedAmount}
                      </span>
                    </div>
                  </TableCell>

                  {/* Desktop-only Points */}
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

                  {/* Desktop-only Stake */}
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
