import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface RankData {
  id: string;
  username: string;
  country: string;
  firstWin: boolean;
  totalWins: number;
  topScoreWin: number;
  manGoSetWin: number;
  leagueWin: number;
  points: number;
  trend: "up" | "down" | "stable";
  topScoreRank: any;
  manGoSetRank: any;
  leagueRank: any;
  worldRank: any;
  countryRank: any;
}

interface LeaderboardTableProps {
  data: RankData[];
  type: "overall" | "topScore" | "manGoSet" | "league";
}

export function LeaderboardTable({ data, type }: LeaderboardTableProps) {
  const getPoints = (item: RankData) => {
    switch (type) {
      case "topScore":
        return item.topScoreRank.points;
      case "manGoSet":
        return item.manGoSetRank.points;
      case "league":
        return item.leagueRank.points;
      default:
        return item.points;
    }
  };

  const getWins = (item: RankData) => {
    switch (type) {
      case "topScore":
        return item.topScoreWin;
      case "manGoSet":
        return item.manGoSetWin;
      case "league":
        return item.leagueWin;
      default:
        return item.totalWins;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Rank</TableHead>
          <TableHead>Player</TableHead>
          <TableHead className="hidden md:table-cell">Country</TableHead>
          <TableHead className="text-right">Wins</TableHead>
          <TableHead className="text-right">Points</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => {
          const rank = index + 1;
          const points = getPoints(item);
          const wins = getWins(item);

          return (
            <TableRow key={item.id} className="group">
              <TableCell className="font-medium text-muted-foreground">
                #{rank}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage
                      src={`/.jpg?key=jr2yy&height=36&width=36&query=${item.username}`}
                    />
                    <AvatarFallback>
                      {item.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {item.username}
                    </span>
                    <span className="text-xs text-muted-foreground md:hidden">
                      {item.country}
                    </span>
                  </div>
                  {item.firstWin && (
                    <Badge
                      variant="secondary"
                      className="ml-2 text-[10px] h-5 px-1.5 hidden sm:flex"
                    >
                      Champion
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="text-sm text-muted-foreground">
                  {item.country}
                </span>
              </TableCell>
              <TableCell className="text-center md:text-right font-mono">
                {wins}
              </TableCell>
              <TableCell className="text-center md:text-right font-bold font-mono text-primary">
                {points.toLocaleString()}
              </TableCell>
              <TableCell>
                <TrendIndicator trend={item.trend} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function TrendIndicator({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <ArrowUp className="w-4 h-4 text-emerald-500" />;
  if (trend === "down") return <ArrowDown className="w-4 h-4 text-rose-500" />;
  return <Minus className="w-4 h-4 text-muted-foreground/50" />;
}
